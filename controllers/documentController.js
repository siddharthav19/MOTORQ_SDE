const AppError = require("./../utils/AppError");
const Document = require("./../models/Document");
const catchAsyncError = require("./../utils/catchAsyncError");

const uploadDocument = catchAsyncError(async (req, res, next) => {
  const owner = req.userId;
  const { title, content } = req.body;
  const document = await Document.create({
    owner,
    title,
    content,
  });
  res.status(201).json({
    title,
    uniqueId: document._id,
  });
});

const getDocument = catchAsyncError(async (req, res, next) => {
  const owner = req.userId;
  const documentsOwned = await Document.find({
    owner,
  });
  const documents = documentsOwned.map((e) => ({
    title: e.title,
    uniqueId: e._id,
  }));
  res.status(200).json({
    documents,
  });
});

const deleteDocument = catchAsyncError(async (req, res, next) => {
  const docId = req.params.documentId;
  const owner = req.userId;
  const doc = await Document.findOne({
    _id: docId,
    owner,
  });
  if (!doc) {
    return next(
      new AppError(
        `You cant delete the document only the owner will be able to delete it`,
        405
      )
    );
  }
  await Document.findOneAndDelete({
    _id: docId,
    owner,
  });
  res.status(204).json({
    status: "deleted document successfuly",
  });
});

exports.uploadDocument = uploadDocument;
exports.getDocument = getDocument;
exports.deleteDocument = deleteDocument;
