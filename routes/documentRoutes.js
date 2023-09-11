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
router.delete(
  "/:documentId",
  authController.loginMiddleware,
  documentController.deleteDocument
);
router
  .route("/:documentId/shared")
  .get(authController.loginMiddleware, documentController.getSharedDocuments) //!TODO
  .post(authController.loginMiddleware, documentController.addAccessToDocument); //!TODO
module.exports = router;
