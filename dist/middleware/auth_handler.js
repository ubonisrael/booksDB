"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHandler = exports.authHandlerMiddleware = void 0;
const auth_error_1 = __importDefault(require("../errors/auth_error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authHandlerMiddleware = (req, res, next) => {
    var _a, _b;
    // check header and return user info if available
    req.user = (0, exports.jwtHandler)(req);
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        // user routes should only be available to admins
        // except the route of the non-admin user's id
        if (req.route == "users" &&
            req.method != "GET" &&
            req.method != "PATCH" &&
            req.params.id &&
            req.params.id != ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId))
            throw new auth_error_1.default("Cannot access this route");
        // for author and book routes, only GET methods should be available to non-admin users
        if (req.method != "GET" && (req.route == "authors" || req.route == "books"))
            throw new auth_error_1.default("User unauthorized to perform this action");
    }
    next();
};
exports.authHandlerMiddleware = authHandlerMiddleware;
// checks the request payload for authorization header
// return user information if available
const jwtHandler = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new auth_error_1.default("Auth invalid");
    const authToken = authHeader.split(" ")[1];
    const payload = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
    // attach user info to routes
    return {
        userId: payload.id,
        username: payload.username,
        isAdmin: payload.admin,
    };
};
exports.jwtHandler = jwtHandler;
