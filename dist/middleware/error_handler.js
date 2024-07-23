"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const library_1 = require("@prisma/client/runtime/library");
const errorHandlerMiddleware = (err, req, res, next) => {
    // console.log(err);
    // console.log(err.name);
    const customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, try again later",
    };
    if (err instanceof library_1.PrismaClientValidationError) {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        customError.message = "Missing field or incorrect field type";
    }
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        if (err.code === 'P2002' && err.meta) {
            if (err.meta.target === 'User_email_key') {
                customError.message = 'Email already in use';
            }
            if (err.meta.target === 'User_username_key') {
                customError.message = 'Username already taken';
            }
        }
        else if (err.code === 'P2025' && err.meta) {
            customError.message = `${err.meta.cause}`;
        }
        else {
            customError.message = "Record to process not found.";
        }
    }
    return res
        .status(customError.statusCode)
        .json({ Error: { message: customError.message } });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
