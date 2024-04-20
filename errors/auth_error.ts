import CustomAPIError from "./custom_api";

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message)
    }
}

export default UnauthenticatedError
