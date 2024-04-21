import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom_api";

class UnauthenticatedError extends CustomAPIError {
    statusCode = StatusCodes.FORBIDDEN;
    constructor(message: string) {
        super(message)
    }
}

export default UnauthenticatedError
