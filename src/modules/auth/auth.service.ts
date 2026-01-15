import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"
import type { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { User } from "./entities/user.entity"
import type { SignUpDto } from "./dto/signup.dto"
import type { SignInDto } from "./dto/signin.dto"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto

    const existingUser = await this.usersRepository.findOne({ where: { email } })
    if (existingUser) {
      throw new BadRequestException("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.usersRepository.save(user)

    return this.generateToken(user)
  }

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto

    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    return this.generateToken(user)
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}
