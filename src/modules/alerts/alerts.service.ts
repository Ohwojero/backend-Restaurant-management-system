import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Alert } from "./entities/alert.entity"
import type { CreateAlertDto } from "./dto/create-alert.dto"

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertsRepository: Repository<Alert>
  ) {}

  create(createAlertDto: CreateAlertDto) {
    const alert = this.alertsRepository.create(createAlertDto)
    return this.alertsRepository.save(alert)
  }

  findAll(locationId?: string, severity?: string) {
    const query = this.alertsRepository.createQueryBuilder("alert")

    if (locationId) {
      query.where("alert.locationId = :locationId", { locationId })
    }

    if (severity) {
      query.andWhere("alert.severity = :severity", { severity })
    }

    return query
      .andWhere("alert.resolved = :resolved", { resolved: false })
      .orderBy("alert.createdAt", "DESC")
      .getMany()
  }

  findOne(id: string) {
    return this.alertsRepository.findOne({
      where: { id },
      relations: ["location"],
    })
  }

  async resolveAlert(id: string) {
    const alert = await this.findOne(id)
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`)
    }
    alert.resolved = true
    alert.resolvedAt = new Date()
    return this.alertsRepository.save(alert)
  }

  async remove(id: string) {
    const alert = await this.findOne(id)
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`)
    }
    return this.alertsRepository.remove(alert)
  }

  async deleteAlertsForItem(itemId: string) {
    // Delete alerts that contain the item ID in their message (since we don't have a direct foreign key)
    await this.alertsRepository
      .createQueryBuilder()
      .delete()
      .from(Alert)
      .where("message LIKE :itemId", { itemId: `%${itemId}%` })
      .execute()
  }
}
