const express = require("express");
const Router = express.Router();
const transactionsController = require("../controllers/transactions");

Router.post("/", transactionsController.postNewTransaction);
Router.get("/", transactionsController.searchTransaction);
Router.patch("/", transactionsController.updateTransaction);
Router.delete("/", transactionsController.deleteTransaction);


module.exports = Router;