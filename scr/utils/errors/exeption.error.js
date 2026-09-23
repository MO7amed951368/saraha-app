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