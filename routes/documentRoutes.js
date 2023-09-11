const express = require("express");
const authController = require("./../controllers/authController");
const documentController = require("./../controllers/documentController");
const router = express.Router();

router.post(
  "/",
  authController.loginMiddleware,
  documentController.uploadDocument
);
router.get("/", authController.loginMiddleware, documentController.getDocument);
module.exports = router;