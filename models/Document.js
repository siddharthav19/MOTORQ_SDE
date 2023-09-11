const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A document must belongs to a user"],
  },
  access: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  title: {
    type: String,
    required: [true, "A Document Must have a title"],
    validate: {
      validator: function (val) {
        return /^[a-zA-Z0-9\s]{1,50}$/.test(val);
      },
      message: "the title doesnot follow the structural requirements",
    },
  },
  content: {
    type: String,
  },
});

const Document = mongoose.model("Document", DocumentSchema);
module.exports = Document;
