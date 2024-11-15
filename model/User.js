const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email value"],
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: "Please enter valid email address",
    },
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please provide username value"],
    unique: true,
    minLength: 3,
    maxLength: 12,
  },
  password: {
    type: String,
    required: [true, "Please provide password value"],
    minLength: 4,
    maxLength: 60,
  },
  role: {
    type: String,
    enum: ["user", "admin", "operator"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    //CHANGE TO FALSE
    default: true,
  },
  verificationToken: {
    type: String,
    default: "",
  },
  passwordResetToken: {
    type: String,
    default: "",
  },
  passwordResetExpDate: {
    type: Date,
    default: null,
  },
});

UserSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", UserSchema);
