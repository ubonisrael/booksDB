import { NextFunction, Request, Response } from "express";

export const routeNameHandlerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // get the name of the api route
    // e.g for example /books returns books
    const route = req.path.split('/')[1]
    req.route = route

    next()
  }