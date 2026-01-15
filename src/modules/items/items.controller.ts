import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { ItemsService } from "./items.service"
import { CreateItemDto } from "./dto/create-item.dto"
import { UpdateItemDto } from "./dto/update-item.dto"

@ApiTags("Items")
@ApiBearerAuth("access_token")
@Controller("api/items")
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: "Add a new inventory item" })
  @ApiResponse({ status: 201, description: "Item created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all inventory items" })
  @ApiQuery({ name: "locationId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of all items" })
  findAll(@Query("locationId") locationId?: string) {
    return this.itemsService.findAll(locationId)
  }

  @Get("low-stock")
  @ApiOperation({ summary: "Get items below reorder level" })
  @ApiQuery({ name: "locationId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of low stock items" })
  getLowStock(@Query("locationId") locationId?: string) {
    return this.itemsService.getLowStockItems(locationId)
  }

  @Get("expiring")
  @ApiOperation({ summary: "Get items expiring soon" })
  @ApiQuery({ name: "locationId", required: false, type: String })
  @ApiQuery({ name: "days", required: false, type: String, description: "Number of days (default: 7)" })
  @ApiResponse({ status: 200, description: "List of expiring items" })
  getExpiring(@Query("locationId") locationId?: string, @Query("days") days?: string) {
    return this.itemsService.getExpiringItems(
      locationId,
      days ? Number.parseInt(days) : 7,
    )
  }

  @Get(":id")
  @ApiOperation({ summary: "Get item details" })
  @ApiResponse({ status: 200, description: "Item details" })
  @ApiResponse({ status: 404, description: "Item not found" })
  findOne(@Param("id") id: string) {
    return this.itemsService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update inventory item" })
  @ApiResponse({ status: 200, description: "Item updated successfully" })
  @ApiResponse({ status: 404, description: "Item not found" })
  update(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete inventory item" })
  @ApiResponse({ status: 200, description: "Item deleted successfully" })
  @ApiResponse({ status: 404, description: "Item not found" })
  remove(@Param("id") id: string) {
    return this.itemsService.remove(id)
  }

  @Get("analytics/daily-cost")
  @ApiOperation({ summary: "Get daily food cost data for the past 7 days" })
  @ApiResponse({ status: 200, description: "Daily cost data" })
  getDailyCost() {
    return this.itemsService.getDailyCostData()
  }

  @Get("analytics/weekly-usage")
  @ApiOperation({ summary: "Get weekly usage data for the past 4 weeks" })
  @ApiResponse({ status: 200, description: "Weekly usage data" })
  getWeeklyUsage() {
    return this.itemsService.getWeeklyUsageData()
  }
}
