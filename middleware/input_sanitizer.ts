import xss from "xss";
import { NextFunction, Request, Response } from "express";

// Custom middleware to sanitize input
export const inputSanitizer = (req: Request, res: Response, next: NextFunction) => {
    // Sanitize query parameters
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        req.query[key] = xss(req.query[key] as string);
      }
    }
  
    // Sanitize request body
    if (req.body) {
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          req.body[key] = xss(req.body[key]);
        }
      }
    }
  
    // Sanitize URL parameters
    for (const key in req.params) {
      if (req.params.hasOwnProperty(key)) {
        req.params[key] = xss(req.params[key]);
      }
    }
  
    next();
  }
