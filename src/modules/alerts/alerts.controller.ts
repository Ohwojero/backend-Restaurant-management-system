import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { AlertsService } from "./alerts.service"
import { CreateAlertDto } from "./dto/create-alert.dto"

@ApiTags("Alerts")
@ApiBearerAuth("access_token")
@Controller("api/alerts")
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new alert" })
  @ApiResponse({ status: 201, description: "Alert created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(createAlertDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all alerts" })
  @ApiQuery({ name: "locationId", required: false, type: String })
  @ApiQuery({ name: "severity", required: false, type: String, enum: ["low", "medium", "high", "critical"] })
  @ApiResponse({ status: 200, description: "List of all alerts" })
  findAll(@Query("locationId") locationId?: string, @Query("severity") severity?: string) {
    return this.alertsService.findAll(locationId, severity)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get alert details" })
  @ApiResponse({ status: 200, description: "Alert details" })
  @ApiResponse({ status: 404, description: "Alert not found" })
  findOne(@Param("id") id: string) {
    return this.alertsService.findOne(id)
  }

  @Patch(":id/resolve")
  @ApiOperation({ summary: "Resolve an alert" })
  @ApiResponse({ status: 200, description: "Alert resolved successfully" })
  @ApiResponse({ status: 404, description: "Alert not found" })
  resolveAlert(@Param("id") id: string) {
    return this.alertsService.resolveAlert(id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete alert" })
  @ApiResponse({ status: 200, description: "Alert deleted successfully" })
  @ApiResponse({ status: 404, description: "Alert not found" })
  remove(@Param("id") id: string) {
    return this.alertsService.remove(id)
  }
}
