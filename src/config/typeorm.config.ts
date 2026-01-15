import type { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Item } from "../modules/items/entities/item.entity"
import { Location } from "../modules/locations/entities/location.entity"
import { Alert } from "../modules/alerts/entities/alert.entity"
import { User } from "../modules/auth/entities/user.entity"

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "restaurant_inventory",
  entities: [Item, Location, Alert, User],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
}
