// authmiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../modals/userModel");
const asyncHandler = require("express-async-handler");

const MAX_USAGE_PER_DAY = 1/60; // Maximum allowed usage per day in hours

const calculateTotalUsageToday = (user) => {
  // Calculate total usage today from user's usage records
  // You'll need to implement this function based on how usage records are stored
  // For example, if you store usage records as an array of timestamps, you can calculate the total hours used today by summing up the differences between consecutive timestamps
};

const shouldAutoLogout = (user) => {
  const totalUsageToday = calculateTotalUsageToday(user);
  return totalUsageToday >= MAX_USAGE_PER_DAY;
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user should be auto-logged out due to excess usage
      if (shouldAutoLogout(req.user)) {
        res.status(403);
        throw new Error("Excessive usage detected. Please try again later.");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
