const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const imgPath = "/uploads/user";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      min: [3, "The user name is too short"],
      max: [20, "The user name is too long"],
      required: [true, "Please provide your name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password."],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please select your gender."],
    },
    interest: Array,
    image: String,
  },
  { timestamps: true }
);

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", imgPath));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});

userSchema.statics.uploadImgPath = multer({ storage: imageStorage }).single(
  "image"
);

userSchema.statics.imgPath = imgPath;
userSchema.index({ email: 1, password: 1 });
const user = mongoose.model("user", userSchema);

module.exports = user;
