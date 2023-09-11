const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, "An User Must have an Mobile Number"],
    unique: true,
    validate: {
      validator: function (val) {
        return /^[0-9]{10}$/.test(val);
      },
      message: "the given number({VALUE}) is an incorrect mobile number",
    },
  },
  password: {
    type: String,
    validate: {
      validator: function (password) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(password);
      },
      message: `password should be at least 8 characters, containing at least one alphabet,number and one special character`,
    },
    required: true,
  },
});

UserSchema.virtual("ownedDocuments", {
  ref: "Document",
  foreignField: "owner",
  localField: "_id",
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
