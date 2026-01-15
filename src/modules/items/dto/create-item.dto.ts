import { IsString, IsNumber, IsDate, IsOptional, IsEnum, Min, IsNotEmpty } from "class-validator"
import { Type } from "class-transformer"

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  sku: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNumber()
  @Min(0)
  quantity: number

  @IsNumber()
  @Min(0)
  reorderLevel: number

  @IsNumber()
  @Min(0)
  reorderQuantity: number

  @IsNumber()
  @Min(0)
  unitPrice: number

  @IsString()
  @IsNotEmpty()
  unit: string

  @IsString()
  @IsNotEmpty()
  supplier: string

  @IsDate()
  @Type(() => Date)
  expiryDate: Date

  @IsOptional()
  @IsEnum(["good", "warning", "critical"])
  status?: "good" | "warning" | "critical"

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  locationId?: string
}
