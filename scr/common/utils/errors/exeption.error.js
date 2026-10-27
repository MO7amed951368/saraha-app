import AppError from "./app.error.js";

export class BadRReqestError extends AppError {
    constructor(message, statusCode = 400, data = {}, code = 'BAD_REQUEST') {
        super(message, statusCode, data, code);
    }
}
export class conflictError extends AppError {
    constructor(message, statusCode = 409, data = {}, code = 'CONFLICT') {
        super(message, statusCode, data, code);
    }
}
export class unauthorizedError extends AppError {
    constructor(message, statusCode = 401, data = {}, code = 'UNAUTHORIZED') {
        super(message, statusCode, data, code);
    }
}
export class notFoundError extends AppError {
    constructor(message, statusCode = 404, data = {}, code = 'NOT_FOUND') {
        super(message, statusCode, data, code);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", statusCode = 403, data = {}, code = 'FORBIDDEN') {
        super(message, statusCode, data, code);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Validation Error", statusCode = 422, data = {}, code = 'VALIDATION_ERROR') {
        super(message, statusCode, data, code);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = "Too Many Requests", statusCode = 429, data = {}, code = 'TOO_MANY_REQUESTS') {
        super(message, statusCode, data, code);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error", statusCode = 500, data = {}, code = 'INTERNAL_SERVER_ERROR') {
        super(message, statusCode, data, code);
    }
}

export class BadGatewayError extends AppError {
    constructor(message = "Bad Gateway", statusCode = 502, data = {}, code = 'BAD_GATEWAY') {
        super(message, statusCode, data, code);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message = "Service Unavailable", statusCode = 503, data = {}, code = 'SERVICE_UNAVAILABLE') {
        super(message, statusCode, data, code);
    }
}
