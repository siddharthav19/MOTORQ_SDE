const mongoose = require("mongoose");
const LinksSchema = new mongoose.Schema({
  link: {
    type: String,
    unique: true,
    required: [true, "Link is required"],
  },
  generatedCount: {
    type: [Number],
    default: 0,
  },
  users: {
    type: [mongoose.Schema.ObjectId],
    default: [],
  },
});

const Link = mongoose.model("Link", LinksSchema);
module.exports = Link;
