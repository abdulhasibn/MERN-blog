import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { validateUsername } from "../utils/validateUsername.js";
import { getHashedPassword } from "../utils/hashPassword.js";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  console.log("Start");
  const { username, password, profilePicture } = req.body;
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "User is unauthorized to make these changes")
    );
  }

  if (password && password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  try {
    validateUsername(username);
  } catch (error) {
    return next(error);
  }

  try {
    const hashedPassword = getHashedPassword(password);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          password: hashedPassword,
          profilePicture,
        },
      },
      { new: true }
    ).lean();

    delete updatedUser.password;
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
