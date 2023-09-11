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
  const user = await User.findOne({ phoneNumber });
  if (!user || password !== user.password) {
    return next(
      new AppError(
        `Invalid Credentials You must be logged in to proceed further`,
        400
      )
    );
  }
  req.userId = user._id;
  next();
});

exports.signupHandler = signupHandler;
exports.loginMiddleware = loginMiddleware;
