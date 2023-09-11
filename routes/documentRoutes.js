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
router
  .route("/:documentId")
  .delete(authController.loginMiddleware, documentController.deleteDocument)
  .get(authController.loginMiddleware, documentController.viewDoc);
router
  .route("/:documentId/shared")
  .get(authController.loginMiddleware, documentController.getSharedDocuments)
  .post(authController.loginMiddleware, documentController.addAccessToDocument);

router.get(
  "/shared",
  authController.loginMiddleware,
  documentController.getAccessibleDocuments
);
module.exports = router;
