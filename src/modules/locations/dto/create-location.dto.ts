import { IsString, IsNumber, IsEnum, IsOptional, Min, IsNotEmpty } from "class-validator"

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsOptional()
  @IsEnum(["active", "inactive"])
  status?: "active" | "inactive"

  @IsNumber()
  @Min(0)
  staffCount: number
}
