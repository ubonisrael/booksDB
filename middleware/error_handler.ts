import { NextFunction, Request, Response } from "express";
import CustomAPIError from "../errors/custom_api";

export const errorHandlerMiddleware = (err: CustomAPIError, req: Request, res: Response, next: NextFunction) => {
    const customError = {
        statusCode: err.statusCode,
        message: err.message || 'Something went wrong, try again later'
    }

    return res.status(customError.statusCode).json({ msg: customError.message })
}
