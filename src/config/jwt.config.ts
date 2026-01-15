export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your_jwt_secret_change_in_production_min_32_chars",
  expiresIn: process.env.JWT_EXPIRATION || "7d",
}
