import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { LocationsService } from "./locations.service"
import { CreateLocationDto } from "./dto/create-location.dto"
import { UpdateLocationDto } from "./dto/update-location.dto"

@ApiTags("Locations")
@ApiBearerAuth("access_token")
@Controller("api/locations")
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new location" })
  @ApiResponse({ status: 201, description: "Location created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all restaurant locations" })
  @ApiResponse({ status: 200, description: "List of all locations" })
  findAll() {
    return this.locationsService.findAll()
  }

  @Get(":id")
  @ApiOperation({ summary: "Get location details" })
  @ApiResponse({ status: 200, description: "Location details" })
  @ApiResponse({ status: 404, description: "Location not found" })
  findOne(@Param("id") id: string) {
    return this.locationsService.findOne(id)
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Get location statistics" })
  @ApiResponse({ status: 200, description: "Location statistics including inventory value and critical items" })
  @ApiResponse({ status: 404, description: "Location not found" })
  getStats(@Param("id") id: string) {
    return this.locationsService.getLocationStats(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update location" })
  @ApiResponse({ status: 200, description: "Location updated successfully" })
  @ApiResponse({ status: 404, description: "Location not found" })
  update(@Param("id") id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete location" })
  @ApiResponse({ status: 200, description: "Location deleted successfully" })
  @ApiResponse({ status: 404, description: "Location not found" })
  remove(@Param("id") id: string) {
    return this.locationsService.remove(id)
  }
}
