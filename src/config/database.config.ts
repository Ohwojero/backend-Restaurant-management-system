import type { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Item } from "../modules/items/entities/item.entity"
import { Location } from "../modules/locations/entities/location.entity"
import { Alert } from "../modules/alerts/entities/alert.entity"
import { User } from "../modules/auth/entities/user.entity"

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
  entities: [Item, Location, Alert, User],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
}
