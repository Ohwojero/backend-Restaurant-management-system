import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Item } from "./entities/item.entity"
import type { CreateItemDto } from "./dto/create-item.dto"
import type { UpdateItemDto } from "./dto/update-item.dto"
import { AlertsService } from "../alerts/alerts.service"

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly alertsService: AlertsService
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = this.itemsRepository.create(createItemDto)
    const savedItem = await this.itemsRepository.save(item)
    await this.checkAndCreateAlerts(savedItem)
    return savedItem
  }

  findAll(locationId?: string) {
    if (locationId) {
      return this.itemsRepository.find({
        where: { locationId },
        relations: ["location"],
      })
    }
    return this.itemsRepository.find({
      relations: ["location"],
    })
  }

  findOne(id: string) {
    return this.itemsRepository.findOne({
      where: { id },
      relations: ["location"],
    })
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(id)
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`)
    }

    Object.assign(item, updateItemDto)
    const savedItem = await this.itemsRepository.save(item)
    await this.checkAndCreateAlerts(savedItem)
    return savedItem
  }

  async remove(id: string) {
    const item = await this.findOne(id)
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`)
    }

    // Delete related alerts before removing the item
    await this.alertsService.deleteAlertsForItem(item.id)

    return this.itemsRepository.remove(item)
  }

  async getLowStockItems(locationId?: string) {
    const query = this.itemsRepository.createQueryBuilder("item")

    if (locationId) {
      query.where("item.locationId = :locationId", { locationId })
    }

    return query
      .where("item.quantity <= item.reorderLevel")
      .orWhere("item.status = :status", { status: "critical" })
      .getMany()
  }

  async getExpiringItems(locationId?: string, daysUntilExpiry = 7) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + daysUntilExpiry)

    const query = this.itemsRepository.createQueryBuilder("item")

    if (locationId) {
      query.where("item.locationId = :locationId", { locationId })
    }

    return query
      .where("item.expiryDate <= :futureDate", { futureDate })
      .andWhere("item.expiryDate >= :today", { today: new Date() })
      .getMany()
  }

  async getDailyCostData() {
    const allItems = await this.findAll()

    // Generate data for the past 7 days
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Calculate daily cost as 10-30% of total inventory value
      const totalValue = allItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
      const dailyCost = Math.round(totalValue * (0.1 + Math.random() * 0.2)) // 10-30% of total value

      data.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        cost: dailyCost,
        date: date.toISOString().split('T')[0]
      })
    }

    return data
  }

  async getWeeklyUsageData() {
    const allItems = await this.findAll()

    // Generate data for the past 4 weeks
    const data = []
    const today = new Date()

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - (i * 7))

      // Calculate weekly usage as 30-70% of total inventory quantity
      const totalQuantity = allItems.reduce((sum, item) => sum + item.quantity, 0)
      const weeklyUsage = Math.round(totalQuantity * (0.3 + Math.random() * 0.4)) // 30-70% of total quantity

      data.push({
        name: `Week ${4 - i}`,
        usage: weeklyUsage,
        weekStart: weekStart.toISOString().split('T')[0]
      })
    }

    return data
  }

  private async checkAndCreateAlerts(item: Item) {
    // Check for low stock alert
    if (item.quantity <= item.reorderLevel) {
      await this.alertsService.create({
        title: "Low Stock Alert",
        message: `${item.name} (${item.sku}) is below reorder level. Current quantity: ${item.quantity}, Reorder level: ${item.reorderLevel} [ITEM:${item.id}]`,
        severity: "warning",
        type: "low_stock",
        locationId: item.locationId,
      })
    }

    // Check for expiring items (within 7 days)
    const expiryDate = new Date(item.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
      const message = daysUntilExpiry === 0
        ? `${item.name} (${item.sku}) expires today on ${expiryDate.toLocaleDateString()} [ITEM:${item.id}]`
        : `${item.name} (${item.sku}) expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} on ${expiryDate.toLocaleDateString()} [ITEM:${item.id}]`

      await this.alertsService.create({
        title: "Expiring Soon",
        message,
        severity: daysUntilExpiry <= 1 ? "critical" : "warning",
        type: "expiring",
        locationId: item.locationId,
      })
    }

    // Check for expired items
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const expiryDateOnly = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate())

    if (expiryDateOnly < todayDate) {
      await this.alertsService.create({
        title: "Item Expired",
        message: `${item.name} (${item.sku}) has expired on ${expiryDate.toLocaleDateString()} [ITEM:${item.id}]`,
        severity: "critical",
        type: "expired",
        locationId: item.locationId,
      })
    }
  }
}
