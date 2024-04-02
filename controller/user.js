require("dotenv").config();
const fs = require("fs");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userMassage } = require("../config/message");

const checkUser = async (email) => {
  try {
    const findUserDetails = await user.findOne({ email: email });
    if (findUserDetails) return true;
  } catch (error) {
    console.log(error);
  }
};

const deletefile = async (file) => {
  try {
    await fs.unlinkSync(file.path);
  } catch (error) {
    console.log(error);
  }
};

const uploadImg = async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      user.uploadImgPath(req, res, async (err) => {
        if (err) return reject(userMassage.error.uploadImage);
        resolve(req.file);
      });
    });
  } catch (error) {
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const file = await uploadImg(req, res);
    if (!req.body)
      return res.status(400).json({ message: userMassage.error.fillDetails });

    const { name, email, password, confirmpassword, gender, interest } =
      req.body;

    if (confirmpassword !== password) {
      await deletefile(file);
      return res
        .status(400)
        .json({ message: userMassage.error.passwordNotMatch });
    }

    const findUser = await checkUser(email);

    if (findUser) {
      await deletefile(file);
      return res.status(400).json({
        message: userMassage.error.invalidEmail,
      });
    }

    let image = "";
    if (req.file) {
      image = user.imgPath + "/" + req.file.filename;
    }

    const newUser = {
      name,
      email,
      gender,
      interest,
      image,
      password: await bcrypt.hash(password, 10),
    };

    const createUser = await user.create(newUser);

    if (!createUser)
      return res.status(400).json({ message: userMassage.error.signUperror });

    return res.status(201).json({ message: userMassage.success.signUpSuccess });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await user.findOne({ email }).lean();

    if (!findUser)
      return res.status(404).json({ message: userMassage.error.userNotFound });

    const isValidPassword = await bcrypt.compare(password, findUser.password);
    delete findUser.password;

    const token = isValidPassword
      ? await jwt.sign({ data: findUser }, process.env.SECRETKEY, {
          expiresIn: "1h",
        })
      : null;

    if (isValidPassword) {
      res.cookie("jwt", token, { httpOnly: true });
      return res.status(200).json({
        message: userMassage.success.loginSuccess,
        token,
      });
    }

    return res.status(400).json({ message: userMassage.error.wrongPassword });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const { name, email, gender, interest, image } = req.user.data;
    const userDetails = {
      name,
      email,
      gender,
      interest,
      image,
    };

    return res.status(200).json({
      message: userMassage.success.profileRetrieved,
      profile: userDetails,
    });
  } catch (error) {
    return res.status(404).json({ message: userMassage.error.userNotFound });
  }
};
