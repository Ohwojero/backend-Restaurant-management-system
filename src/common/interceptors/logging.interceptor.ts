import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler, Logger } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP")

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, ip } = request
    const userAgent = request.get("user-agent")

    const now = Date.now()

    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse()
        const { statusCode } = response
        const contentLength = response.get("content-length")
        const duration = Date.now() - now

        this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${ip} - ${userAgent} - ${duration}ms`)
      }),
    )
  }
}
