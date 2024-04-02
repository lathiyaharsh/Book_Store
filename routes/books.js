const express = require("express");
const routes = express.Router();
const book = require("../controller/book");

routes.post("/", book.createBook);
routes.get("/", book.books);
routes.get("/:id", book.findBook);
routes.put("/:id", book.editBook);
routes.delete("/:id", book.deleteBook);

module.exports = routes;
