import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { validateUsername } from "../utils/validateUsername.js";
import { getHashedPassword } from "../utils/hashPassword.js";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

//Sign Up
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    try {
      validateUsername(username);
    } catch (error) {
      return next(error);
    }
    const hashedPassword = getHashedPassword(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    res.status(201).json("Signed up successfully");
  } catch (error) {
    next(error);
  }
};

//Sign In

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({
      email,
    }).lean();

    if (!validUser) {
      return next(errorHandler(404, "User not Found"));
    }
    const isValidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!isValidPassword) {
      return next(errorHandler(403, "Incorrect Password"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET_STRING as string
    );

    const { password: pass, ...rest } = validUser;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//Adding users signed up using Google OAuth, to the database

export async function googleSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_STRING as string
      );
      const { password, ...rest } = user;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const username =
        name.toLocaleLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_STRING as string
      );
      const { password, ...rest } = newUser;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
}

export const signout = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {}
};
