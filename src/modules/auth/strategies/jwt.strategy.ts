import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

const jwtConfig = {
  secret: process.env.JWT_SECRET || "your_jwt_secret_change_in_production_min_32_chars",
  expiresIn: process.env.JWT_EXPIRATION || "7d",
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role }
  }
}
