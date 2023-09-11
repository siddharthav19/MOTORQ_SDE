const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, "An User Must have an Mobile Number"],
    unique: true,
    validate: {
      validator: function (val) {
        return /^[0-9]{10}$/.test(val);
      },
      message: "the given number({VALUE}) is an incorrect number",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
