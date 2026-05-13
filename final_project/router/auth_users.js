const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  const findUser = users.find((user) => user.username == username);
  return !findUser;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const findUser = users.find((user) => user.username == username);
  console.log(users, username, findUser )
  if (findUser) {
    return username == findUser.username && findUser.password == password;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.query;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ data: password }, "customer", {
        expiresIn: "1h",
      });
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.json({message: "Login successfully"});
    } else {
      return res.status(406).json({ message: "you aren't an user yet" });
    }
  } else {
    return res.status(406).json({ message: "put the data" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const book = books.find((book) => book.isbn == req.params.isbn);
  if (book) {
    const findReview = book.reviews.find(
      (review) => review.user == req.session["username"],
    );
    if (findReview) {
      findReview.review = review;
      return res.json({ message: "Review updated succesfully" });
    } else {
      book.reviews.push({ user: req.session["username"], review });
      return res.json({ message: "Review created successfully" });
    }
  } else {
    return res.status(404).json({ message: "That book doesn't exist" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookfound = books.find((book) => book.isbn == req.params.isbn);
  if (bookfound) {
    const restReview = bookfound.reviews.filter(
      (review) => review.user !== req.session["username"],
    );
      bookfound.reviews = restReview;
      books.filter(book => book.isbn !== req.params.isbn)
      books.push(bookfound)
      res.json({ message: "review deleted successfully" });
  } else {
    return res.status(404).json({ message: "That book doesn't exist" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
