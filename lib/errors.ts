export class AppError extends Error {
  statusCode: number
  customCode: string

  constructor(
    message = 'Internal Server Error',
    statusCode = 500,
    customCode = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.statusCode = statusCode
    this.customCode = customCode

    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', customCode = 'UNAUTHORIZED') {
    super(message, 401, customCode)

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')

    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', customCode = 'NOT_FOUND') {
    super(message, 404, customCode)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
