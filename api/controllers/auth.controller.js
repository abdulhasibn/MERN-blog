import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
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
      res.status(405).json({ error: "All fields are required" });
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
    res.status(400).json({ error: error.message });
  }
};
