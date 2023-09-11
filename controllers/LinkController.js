const catchAsyncError = require("./../utils/catchAsyncError");
const Document = require("./../models/Document");
const Link = require("../models/Link");
const AppError = require("../utils/AppError");
const LinkBaseURI = "http://localhost:3000/links/";
const split1 = "/links/";
const generateLink = catchAsyncError(async (req, res, next) => {
  const { docId } = req.body;
  const doc = await Document.findById(docId);
  const link = LinkBaseURI + docId + "$" + doc.generatedLinkCount;
  const storedLink = split1 + docId + "$" + doc.generatedLinkCount;
  await Link.create({
    link: storedLink,
  });
  doc.generatedLinkCount = doc.generatedLinkCount + 1;
  doc.links.push(storedLink);
  await doc.save();
  res.status(201).json({
    link,
  });
});

const accessThroughLink = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const path = req.path;
  const url = req.path.split(split1)[1];
  const split2ndPart = url.split("$")[0]; //this would be the id
  const doc = await Document.findById(split2ndPart);
  if (!doc) {
    return next(new AppError("Link doesnot point to any document"), 402);
  }
  const linksArr = doc.links;
  const exists = false;
  linksArr.forEach((e) => {
    if (e === path) {
      exists = true;
    }
  });
  if (!exists) {
    return next(new AppError("You dont have access to the link", 403));
  }
  console.log(split2ndPart);
  const linkDoc = await Link.findOne({
    link: path,
  });
  linkDoc.users.push(userId);
  await linkDoc.save();

  res.status(200).json({
    doc,
  });
});

const deleteLink = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const path = req.path;
  const url = req.path.split(split1)[1];
  const split2ndPart = url.split("$")[0]; //this would be the id
  const doc = await Document.findById(split2ndPart);

  res.status(204).json({
    status: "deleted the link",
  });
});

// exports.deleteLink = deleteLink;
exports.generateLink = generateLink;
exports.accessThroughLink = accessThroughLink;
