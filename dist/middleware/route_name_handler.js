"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNameHandlerMiddleware = void 0;
const routeNameHandlerMiddleware = (req, res, next) => {
    // get the name of the api route
    // e.g for example /books returns books
    const route = req.path.split('/')[1];
    req.route = route;
    next();
};
exports.routeNameHandlerMiddleware = routeNameHandlerMiddleware;
