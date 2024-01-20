import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (
      !username ||
      !password ||
      !email ||
      username == "" ||
      password == "" ||
      email == ""
    ) {
      next(errorHandler(400, "All fields are required"));
    }

    const salt = bcryptjs.genSaltSync();

    const hashedPassword = bcryptjs.hashSync(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};
