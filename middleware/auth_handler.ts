import { NextFunction, Request, Response } from "express";
import UnauthenticatedError from "../errors/auth_error";
import jwt from 'jsonwebtoken'
import { JwtPayload } from "../types/custom";

export const authHandlerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // check header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('Auth invalid')
    
    const authToken = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(authToken, process.env.JWT_SECRET as string) as JwtPayload
        // attach user info to routes
        req.user = {userId: payload.id, username: payload.username, isAdmin: payload.admin}
        next()
    } catch (e) {        
        throw new UnauthenticatedError('Auth invalid')
    }
  }