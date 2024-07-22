import { NextFunction, Request, Response } from "express";
import CustomAPIError from "../errors/custom_api";
import { StatusCodes } from "http-status-codes";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const errorHandlerMiddleware = (
  err: CustomAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err);
  // console.log(err.name);
  

  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong, try again later",
  };

  if (err instanceof PrismaClientValidationError) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = "Missing field or incorrect field type";
  }
  if (err instanceof PrismaClientKnownRequestError) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    if (err.code === 'P2002' && err.meta) {
      if (err.meta.target === 'User_email_key') {
        customError.message = 'Email already in use'
      }
      if (err.meta.target === 'User_username_key') {
        customError.message = 'Username already taken'
      }
    } else if (err.code === 'P2025' && err.meta) {
      customError.message = `${err.meta.cause}`
    } else {
      customError.message = "Record to process not found.";
    }
  }

  return res
    .status(customError.statusCode)
    .json({ Error: { message: customError.message } });
};
