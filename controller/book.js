const book = require("../models/book");
const { bookMassage } = require("../config/message");
const { bookDetails } = require("../config/config");

module.exports.createBook = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: bookMassage.error.fillDetails });

    const { id } = req.user.data._id;

    const {
      name,
      description,
      no_of_page,
      author,
      category,
      price,
      released_year,
      userId = id,
    } = req.body;

    const newBookData = {
      name,
      description,
      no_of_page,
      author,
      category,
      price,
      released_year,
      userId,
    };

    const newBook = await book.create(newBookData);
    if (!newBook)
      return res.status(400).json({ message: bookMassage.error.add });

    return res.status(201).json({ message: bookMassage.success.add });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: bookMassage.error.genericError });
  }
};

module.exports.books = async (req, res) => {
  try {
    const { page, search, limit } = req.query;
    if (search && search.trim()) {
      const regex = new RegExp(search, "i");
      const searchBook = await book.find({ name: regex });

      return res.status(200).json({
        message: bookMassage.success.fetch,
        bookList: searchBook,
      });
    }
    const pageCount = page || bookDetails.pageCount;
    const limitDoc = limit || bookDetails.limitDoc;
    const totalBooks = await book.countDocuments({ status: true });
    const maxPage =
      totalBooks <= limitDoc ? 1 : Math.ceil(totalBooks / limitDoc);

    if (pageCount > maxPage)
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page` });

    const skip = (pageCount - 1) * limitDoc;

    const bookList = await book
      .find({ status: true })
      .skip(skip)
      .limit(limitDoc)
      .exec();

    return res.status(200).json({
      message: bookMassage.success.fetch,
      bookList: bookList,
    });
  } catch (error) {
    return res.status(500).json({ message: bookMassage.error.genericError });
  }
};

module.exports.findBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookDetails = await book
      .findById(id)
      .populate("userId", "name -_id")
      .exec();

    if (!bookDetails)
      return res.status(404).json({ message: bookMassage.error.notFound });

    return res.status(200).json({
      message: bookMassage.success.fetch,
      bookDetails: bookDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: bookMassage.error.genericError });
  }
};

module.exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;

    const editBookDetails = await book.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!editBookDetails)
      return res.status(400).json({
        message: bookMassage.error.update,
        bookDetails: editBookDetails,
      });

    return res.status(200).json({
      message: bookMassage.success.update,
      bookDetails: editBookDetails,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: bookMassage.error.genericError });
    
  }
};

module.exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = await book.findByIdAndDelete(id);
    if (!deleteBook)
      return res.status(400).json({ message: bookMassage.error.delete });

    return res.status(200).json({
      message: bookMassage.success.delete,
      deleteBook: deleteBook,
    });
  } catch (error) {
    return res.status(500).json({ message: bookMassage.error.genericError });
  }
};
