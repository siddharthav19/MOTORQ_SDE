const AppError = require("../Utils/AppError");

const handleJWTExpiredError = () =>
  new AppError("Your Token has expired please login again", 401);

const handleJWTError = () =>
  new AppError("Your Token has been modified please login again", 401);

const handleDuplicateFieldsDB = (err) => {
  // console.log(err.keyValue.name);
  // const message = `Duplicate field value : "${
  //   err.keyValue.name
  // }" please use another value`;
  // return new AppError(message, 400);

  //Object.values(err.keyValue) gives array of props which are causing unique value error

  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}.please Use another value.`;
  return new AppError(message, 400);
};
const handleCastErrorDB = (err) => {
  const message = `Invalid value assigned to ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => {
    return val.message;
  });
  // console.log(errors);
  const message = `Invalid Input Data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

//to build a error object and send response based on the error object
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stackTrace: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went really wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  //404 -> fail (should ask modify this codes)
  //500 -> error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);
    // console.log(error.name);
    if (error.constructor.name === "CastError")
      error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    sendErrorProd(error, res);
  }
};
