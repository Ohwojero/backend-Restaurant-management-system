import { type PipeTransform, Injectable, BadRequestException, type ValidationError } from "@nestjs/common"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: any) {
    const object = plainToClass(metadata.type, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      const messages = errors.flatMap((error: ValidationError) => ({
        field: error.property,
        constraints: error.constraints,
      }))

      throw new BadRequestException({
        statusCode: 400,
        message: "Validation failed",
        errors: messages,
      })
    }

    return value
  }
}
