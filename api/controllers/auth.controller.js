import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

//Sign Up
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

//Sign In

export async function signIn(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not Found"));
    }
    const isValidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!isValidPassword) {
      return next(errorHandler(403, "Incorrect Password"));
    }

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET_STRING);

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access-token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
