import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  constructor(message?: string) {
    super(message);
  }
}

export default CustomAPIError;
