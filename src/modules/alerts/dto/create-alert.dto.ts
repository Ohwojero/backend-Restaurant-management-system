import { IsString, IsEnum, IsNumber, IsOptional, IsNotEmpty, Min } from "class-validator"

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  message: string

  @IsOptional()
  @IsEnum(["info", "warning", "critical", "error"])
  severity?: "info" | "warning" | "critical" | "error"

  @IsString()
  @IsNotEmpty()
  type: string

  @IsOptional()
  @IsString()
  locationId?: string
}
