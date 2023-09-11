const catchAsyncError = require("../utils/catchAsyncError");
const User = require("./../models/User");
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find().select("phoneNumber");
  const numbers = users.map((e) => e.phoneNumber);
  res.json({
    users: numbers,
  });
});
exports.getAllUsers = getAllUsers;