import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import { ICustomError, errorHandler } from "./utils/error";

const app = express();
app.use(express.json());
app.use(cookieParser());
config();

//--------------------------

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(errorHandler(404, `Can't find ${req.originalUrl} on this server!`));
});

//error handling middleware

app.use(
  (
    error: ICustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const errorCode = error.code;
    const resObject = { success: false, statusCode, message, errorCode };
    console.error(resObject);
    res.status(statusCode).json(resObject);
  }
);
//--------------------------

const PORT = process.env.PORT || 3000;
const MONGO_STRING = process.env.MONGO_STRING;

async function connectToDb(): Promise<void> {
  try {
    await mongoose.connect(MONGO_STRING as string, {
      autoIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Connected to DB and server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

connectToDb();
