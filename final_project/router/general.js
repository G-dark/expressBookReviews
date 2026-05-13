const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(201).json({ success: "user created" });
    } else {
      return res.status(406).json({ error: "username already use" });
    }
  } else {
    return res.status(406).json({ error: "put the necessary data" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const findBook = books.find((book) => book.isbn == req.params.isbn);
  if (findBook) {
    return res.json({ findBook });
  } else {
    return res.status(404).json({ error: "That book doesn't exist" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const findBooks = books.filter((book) => book.author == req.params.author);
  if (findBooks) {
    return res.json(findBooks);
  } else {
    return res
      .statusCode(404)
      .json({ error: "There are no books with that author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const findBooks = books.filter((book) => book.title == req.params.title);
  if (findBooks) {
    return res.json(findBooks);
  } else {
    return res.json({ error: "There are no books with that title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const findBook = books.find((book) => book.isbn == req.params.isbn);
  if (findBook) {
    return res.json(findBook.reviews);
  } else {
    return res.json({ error: "That book doesn't exist" });
  }
});

const getAllBooks = async (baseurl) => {
  try {
    const getAllBooks = await axios.get(baseUrl);
    return getAllBooks;
  } catch (error) {}
};
const getBookByIsbn = async (baseurl, isbn) => {
  try {
    const getBookByIsbn = await axios.get(baseUrl + "/isbn/"+isbn);
    return getBookByIsbn;
  } catch (error) {
    return { message: "There is an error" };
  }
};
const getBookByAuthor = async (baseurl, author) => {
  try {
    const getBookByAuthor = await axios.get(
      baseUrl + "/author/"+ author,
    );
    return getBookByAuthor;
  } catch (error) {
    return { message: "There is an error" };
  }
};
const getBookByTitle = async (baseurl, title) => {
  
  try {
    const getBookByTitle = await axios.get(baseUrl + "/title/" + title);
    return getBookByTitle;
  } catch (error) {
    return { message: "There is an error" };
  }
};
module.exports.general = public_users;
