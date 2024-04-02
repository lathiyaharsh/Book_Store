require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB);
const db = mongoose.connection;

db.once("open", (err) => {
  err
    ? console.log("Mongodb not connected")
    : console.log("Mongodb connected....");
});

module.exports = db;
