import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import helmet from "helmet"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Restaurant Inventory Management API")
    .setDescription("Complete API for restaurant inventory management with authentication")
    .setVersion("1.0.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access_token"
    )
    .addTag("Auth", "Authentication endpoints")
    .addTag("Items", "Inventory item management")
    .addTag("Locations", "Restaurant location management")
    .addTag("Alerts", "Alert management")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  // Security
  app.use(helmet())

  // CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean) as string[],
    credentials: true,
  })

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Logging
  app.useGlobalInterceptors(new LoggingInterceptor())

  const port = process.env.PORT || 3002
  await app.listen(port, "0.0.0.0")

  console.log(`🚀 Restaurant Inventory API running on port ${port}`)
}

bootstrap()
