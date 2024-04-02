require("dotenv").config();
const jwt = require("jsonwebtoken");
const { userMassage } = require("./message");

const verifyToken = (req, res, next) => {
  const token = req.cookies['jwt'];
  if (!token)
    return res.status(403).json({ message: userMassage.error.tokenMissing });

  jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: userMassage.error.unauthorized });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
