const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res
      .status(400)
      .json({ message: "Username AND password are required to register" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User successfully registered!" });
});

public_users.get("/users", (req, res) => {
  res.send(JSON.stringify(users, null, 4));
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn]));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  let booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  let booksByTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found or no reviews available" });
  }
});
module.exports.general = public_users;
