import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SeedService } from "./seeds/seed.service"
import { User } from "../modules/auth/entities/user.entity"
import { Location } from "../modules/locations/entities/location.entity"
import { Item } from "../modules/items/entities/item.entity"
import { Alert } from "../modules/alerts/entities/alert.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User, Location, Item, Alert])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
