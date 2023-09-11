const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
const catchAsyncError = require("./../utils/catchAsyncError");
const User = require("./../models/User");
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signupHandler = catchAsyncError(async (req,res,next)=>{
     
})