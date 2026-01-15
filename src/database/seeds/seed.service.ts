import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { User } from "../../modules/auth/entities/user.entity"
import { Location } from "../../modules/locations/entities/location.entity"
import { Item } from "../../modules/items/entities/item.entity"
import { Alert } from "../../modules/alerts/entities/alert.entity"

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
  ) {}

  async seed() {
    // Check if data exists
    const userCount = await this.userRepository.count()
    if (userCount > 0) {
      console.log("Database already seeded, skipping...")
      return
    }

    // Demo user creation skipped for testing

    // Create locations
    const locations = [
      {
        name: "Downtown Branch",
        address: "123 Main Street, Downtown",
        city: "New York",
        staffCount: 25,
        status: "active",
      },
      {
        name: "Airport Terminal",
        address: "456 Airport Road, Terminal 2",
        city: "Los Angeles",
        staffCount: 18,
        status: "active",
      },
      {
        name: "Shopping Mall",
        address: "789 Mall Drive, Level 3",
        city: "Chicago",
        staffCount: 22,
        status: "active",
      },
    ]

    const savedLocations = await this.locationRepository.save(locations as any)

    // Create items
    const items = [
      {
        name: "Tomato",
        sku: "TOM-001",
        quantity: 50,
        unit: "kg",
        supplier: "Fresh Farms Co.",
        unitPrice: 2.5,
        reorderLevel: 20,
        reorderQuantity: 50,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: "Vegetables",
        location: savedLocations[0],
      },
      {
        name: "Chicken Breast",
        sku: "CHK-001",
        quantity: 35,
        unit: "kg",
        supplier: "Premium Meat",
        unitPrice: 8.0,
        reorderLevel: 15,
        reorderQuantity: 35,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        category: "Meat",
        location: savedLocations[0],
      },
      {
        name: "Olive Oil",
        sku: "OIL-001",
        quantity: 8,
        unit: "litre",
        supplier: "Mediterranean Import",
        unitPrice: 12.0,
        reorderLevel: 10,
        reorderQuantity: 8,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        category: "Oils",
        location: savedLocations[1],
      },
      {
        name: "Rice",
        sku: "RIC-001",
        quantity: 5,
        unit: "kg",
        supplier: "Grain Suppliers",
        unitPrice: 1.5,
        reorderLevel: 30,
        reorderQuantity: 5,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        category: "Grains",
        location: savedLocations[1],
      },
    ]

    const savedItems = await this.itemRepository.save(items)

    // Create alerts
    const alerts = [
      {
        title: "Low Stock: Rice",
        message: "Rice inventory is below reorder level (5 kg < 30 kg)",
        type: "warning",
        severity: "warning",
        relatedItem: savedItems[3],
        location: savedLocations[1], // Rice is at Airport Terminal
        resolved: false,
      },
      {
        title: "Expiring Soon: Chicken Breast",
        message: "Chicken Breast expires in 10 days",
        type: "expiry",
        severity: "warning",
        relatedItem: savedItems[1],
        location: savedLocations[0], // Chicken is at Downtown Branch
        resolved: false,
      },
    ]

    await this.alertRepository.save(alerts as any)

    console.log("Database seeding completed successfully!")
  }
}
