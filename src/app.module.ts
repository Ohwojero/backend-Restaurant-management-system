import { Module, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { APP_PIPE, APP_FILTER } from "@nestjs/core"
import { databaseConfig } from "./config/database.config"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"
import { ItemsModule } from "./modules/items/items.module"
import { LocationsModule } from "./modules/locations/locations.module"
import { AlertsModule } from "./modules/alerts/alerts.module"
import { AuthModule } from "./modules/auth/auth.module"
import { SeedService } from "./database/seeds/seed.service"
import { DatabaseModule } from "./database/database.module"
import { User } from "./modules/auth/entities/user.entity"
import { Item } from "./modules/items/entities/item.entity"
import { Location } from "./modules/locations/entities/location.entity"
import { Alert } from "./modules/alerts/entities/alert.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Item, Location, Alert]),
    DatabaseModule,
    ItemsModule,
    LocationsModule,
    AlertsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private seedService: SeedService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV !== "production") {
      await this.seedService.seed()
    }
  }
}
