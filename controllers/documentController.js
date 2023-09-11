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
  res.status(200).json({
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

exports.uploadDocument = uploadDocument;
exports.getDocument = getDocument;
