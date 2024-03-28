import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./error.js";
import { ICustomRequest } from "./customTypes.js";

export const verifyUser = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    next(errorHandler(401, "Unauthorized Access"));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_STRING as string,
    (err: any, user: any) => {
      if (err) {
        next(errorHandler(401, "Unauthorized Access"));
      }
      req.user = user;
      next();
    }
  );
};
