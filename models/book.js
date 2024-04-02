const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    name: {
      type: String,
      min: [3, "The book name is too short."],
      max: [30, "The book name is too long."],
      required: [true, "Please enter the name of the book."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description of the book."],
      trim: true,
    },
    no_of_page: {
      type: Number,
      required: [true, "Please enter the number of pages in the book."],
    },
    author: {
      type: String,
      min: [3, "The author name is too short."],
      max: [20, "The author name is too long."],
      required: [true, "Please provide the name of the author of the book."],
      trim: true,
    },
    category: {
      type: String,
      min: [3, "The category name is too short."],
      max: [15, "The category name is too long."],
      required: [true, "Please provide the name of the category."],
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Please enter the price of the book."],
    },
    released_year: {
      type: Number,
      length: [4, "Please enter the correct release year of the book in the format: YYYY."],
      required: [true,"Please enter the year in which the book was released."],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const book = mongoose.model("book", bookSchema);

module.exports = book;
