import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Location } from "./entities/location.entity"
import type { CreateLocationDto } from "./dto/create-location.dto"
import type { UpdateLocationDto } from "./dto/update-location.dto"

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>
  ) {}

  create(createLocationDto: CreateLocationDto) {
    const location = this.locationsRepository.create(createLocationDto)
    return this.locationsRepository.save(location)
  }

  async findAll() {
    const locations = await this.locationsRepository.find({
      relations: ["items", "alerts"],
    })
    return locations.map(location => ({
      ...location,
      totalItems: location.items.length,
      inventoryValue: location.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    }))
  }

  findOne(id: string) {
    return this.locationsRepository.findOne({
      where: { id },
      relations: ["items", "alerts"],
    })
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = await this.findOne(id)
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`)
    }
    Object.assign(location, updateLocationDto)
    return this.locationsRepository.save(location)
  }

  async remove(id: string) {
    const location = await this.findOne(id)
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`)
    }
    return this.locationsRepository.remove(location)
  }

  async getLocationStats(id: string) {
    const location = await this.findOne(id)
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`)
    }

    const totalItems = location.items.length
    const totalValue = location.items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0)
    const criticalItems = location.items.filter((item: any) => item.status === "critical").length

    return {
      location,
      stats: {
        totalItems,
        totalValue,
        criticalItems,
        staff: location.staffCount,
      },
    }
  }
}
