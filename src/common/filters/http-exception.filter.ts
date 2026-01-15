import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, Logger } from "@nestjs/common"
import type { Response } from "express"

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const errorResponse: any =
      typeof exceptionResponse === "object" ? exceptionResponse : { message: exceptionResponse }

    this.logger.error(`HTTP Exception: ${status} - ${JSON.stringify(errorResponse)}`)

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: errorResponse.message || "Internal server error",
      error: errorResponse.error || "Error",
    })
  }
}
