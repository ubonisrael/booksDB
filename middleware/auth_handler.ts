import { NextFunction, Request, Response } from "express";
import UnauthenticatedError from "../errors/auth_error";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/custom";

export const authHandlerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check header and return user info if available
  req.user = jwtHandler(req)

  if (!req.user?.isAdmin) {
    // user routes should only be available to admins
    // except the route of the non-admin user's id
    if (
      req.route == "users" &&
      req.method != "GET" &&
      req.method != "PATCH" &&
      req.params.id &&
      req.params.id != req.user?.userId
    )
      throw new UnauthenticatedError("Cannot access this route");

    // for author and book routes, only GET methods should be available to non-admin users
    if (req.method != "GET" && (req.route == "authors" || req.route == "books"))
      throw new UnauthenticatedError(
        "User unauthorized to perform this action"
      );
  }
  next();
};

// checks the request payload for authorization header
// return user information if available
export const jwtHandler = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new UnauthenticatedError("Auth invalid");

  const authToken = authHeader.split(" ")[1];

  const payload = jwt.verify(
    authToken,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  // attach user info to routes
  return {
    userId: payload.id,
    username: payload.username,
    isAdmin: payload.admin,
  };
};
