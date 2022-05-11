const express = require("express");
const Router = express.Router();
const transactionsController = require("../controllers/transactions");
const validate = require("../middleware/transactionValidation")

Router.post("/",validate.addNewTransaction, transactionsController.postNewTransaction);
Router.get("/", transactionsController.searchTransaction);
Router.patch("/",validate.updateTransaction, transactionsController.updateTransaction);
Router.delete("/", transactionsController.deleteTransaction);


module.exports = Router;