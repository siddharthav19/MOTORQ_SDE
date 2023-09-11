const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const globalErrorHandler = require("./controllers/errorHandler");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const documentRouter = require("./routes/documentRoutes");
dotenv.config({
  path: "./config.env",
});

const app = express();
const PORT = 3000;
const DB_URI = process.env.DB_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", userController.getAllUsers);
app.post("/signup", authController.signupHandler);
app.use("/document", documentRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`db and server running at ${PORT}`));
  });
