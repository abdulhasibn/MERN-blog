import { MongooseError } from "mongoose";

export interface ICustomError extends Error, MongooseError {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (statusCode: number, message: any) => {
  const error: ICustomError = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
