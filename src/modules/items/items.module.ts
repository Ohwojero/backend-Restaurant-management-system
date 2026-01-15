import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ItemsService } from "./items.service"
import { ItemsController } from "./items.controller"
import { Item } from "./entities/item.entity"
import { AlertsModule } from "../alerts/alerts.module"

@Module({
  imports: [TypeOrmModule.forFeature([Item]), AlertsModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
