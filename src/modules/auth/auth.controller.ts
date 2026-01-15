import { Controller, Post, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { SignUpDto } from "./dto/signup.dto"
import { SignInDto } from "./dto/signin.dto"

@ApiTags("Auth")
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({ summary: "Create a new user account" })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    schema: {
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input or email already exists" })
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto)
  }

  @Post("signin")
  @ApiOperation({ summary: "Login with email and password" })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: "User logged in successfully",
    schema: {
      properties: {
        access_token: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto)
  }
}
