import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";

const app = express();
config();

app.get("/", (req, res) => {
  res.json({ msg: "Hello" });
});

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
