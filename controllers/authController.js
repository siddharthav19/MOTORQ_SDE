const AppError = require("./../utils/AppError");
const catchAsyncError = require("./../utils/catchAsyncError");
const User = require("./../models/User");

const signupHandler = catchAsyncError(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const user = await User.create({
    phoneNumber,
    password,
  });
  res.json({
    id: user._id,
    phoneNumber,
    status: "User created successfully",
  });
});

const loginMiddleware = catchAsyncError(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const user = await User.find({ phoneNumber });
  if (!user || password != user.password) {
    return next(new AppError(`Invalid Credentials`, 400));
  }
  next();
});

exports.signupHandler = signupHandler;
exports.loginMiddleware = loginMiddleware;
