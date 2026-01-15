import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from "class-validator"

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string
}
