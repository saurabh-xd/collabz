import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("_id name email");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User associated with token no longer exists",
    });
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  next();
});
