import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(express.json());
config();

//--------------------------

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//error handling middleware

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const errorCode = error.code;

  res
    .status(statusCode)
    .json({ success: false, statusCode, message, errorCode });
});
//--------------------------

const PORT = process.env.PORT || 3000;
const MONGO_STRING = process.env.MONGO_STRING;

async function connectToDb() {
  try {
    await mongoose.connect(MONGO_STRING);
    app.listen(PORT, () => {
      console.log(`Connected to DB and server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

connectToDb();
