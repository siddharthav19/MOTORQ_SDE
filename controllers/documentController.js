const AppError = require("./../utils/AppError");
const Document = require("./../models/Document");
const catchAsyncError = require("./../utils/catchAsyncError");
const User = require("../models/User");

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
        `You cant delete the document only the owner will be able to delete it/document has been removed`,
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

const getSharedDocuments = catchAsyncError(async (req, res, next) => {
  const docId = req.params.documentId;
  const owner = req.userId;
  console.log(docId, owner);
  const users = await Document.findOne({ _id: docId, owner }).populate(
    "access"
  );
  console.log(users);
  return res.status(200).json({
    users: users?.access,
    results: users?.access?.length,
  });
});

const addAccessToDocument = catchAsyncError(async (req, res, next) => {
  const docId = req.params.documentId;
  const owner = req.userId;
  const addNumbers = req.body.mobileNumbers;
  let arr = [];
  addNumbers.forEach(async (e) => {
    const x = await User.findOne({ phoneNumber: e });
    if (x !== null) arr.push(x._id);
  });
  const doc = await Document.findOne({ _id: docId, owner });
  if (!doc) {
    return next(new AppError("doc doesnot exists", 404));
  }
  let x = doc.access.length;
  for (let i = 0; i < x; i++) {
    doc.access.pop();
  }
  await doc.save();
  arr.forEach((e) => {
    doc.access.push(e);
  });
  await doc.save();
  console.log(doc);
  res.status(201).json({
    status: "Document Shared Successfully",
  });
});

const getAccessibleDocuments = catchAsyncError(async (req, res, next) => {
  const ownerId = req.userId;
  const docs = await Document.aggregate([
    {
      $unwind: "$access",
    },
    {
      $match: {
        access: ownerId,
      },
    },
    {
      $project: {
        title: 1,
        _id: 1,
        owner: 1,
      },
    },
  ]);
  console.log(docs);
  res.json({
    accesible: docs,
  });
});

const viewDoc = catchAsyncError(async (req, res, next) => {
  const ownerId = req.userId;
  const docId = req.params.documentId;
  const docs = await Document.aggregate([
    {
      $unwind: "$access",
    },

    {
      $match: {
        $or: [{ accesible: ownerId }, { owner: ownerId }],
        // $and: [
        //   { $or: [{ accesible: ownerId }, { owner: ownerId }] },
        //   { _id: docId },
        // ],
      },
    },
    {
      $project: {
        title: 1,
        _id: 1,
        owner: 1,
      },
    },
  ]);
  const document = docs.find((e) => {
    return e._id == docId;
  });
  if (!document) {
    res.status(406).json({
      message: "Document doesnot exists/You cannot access the document",
    });
  }
  console.log(document);
  res.status(200).json({
    document,
  });
});

exports.uploadDocument = uploadDocument;
exports.getDocument = getDocument;
exports.deleteDocument = deleteDocument;
exports.getSharedDocuments = getSharedDocuments;
exports.addAccessToDocument = addAccessToDocument;
exports.getAccessibleDocuments = getAccessibleDocuments;
exports.viewDoc = viewDoc;
