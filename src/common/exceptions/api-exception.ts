export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly details?: any,
  ) {
    super(message)
    this.name = "ApiException"
  }
}

export class NotFoundException extends ApiException {
  constructor(message = "Resource not found") {
    super(404, message)
  }
}

export class BadRequestException extends ApiException {
  constructor(message = "Bad request") {
    super(400, message)
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message = "Unauthorized") {
    super(401, message)
  }
}

export class ConflictException extends ApiException {
  constructor(message = "Conflict") {
    super(409, message)
  }
}
