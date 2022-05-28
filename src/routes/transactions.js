const express = require("express");
const Router = express.Router();
const transactionsController = require("../controllers/transactions");
const validate = require("../middleware/transactionValidation");
const checkToken = require("../middleware/authValidation");

Router.post("/", checkToken.checkToken, validate.addNewTransaction, transactionsController.postNewTransaction);

Router.get("/", checkToken.checkToken, checkToken.adminAuth, transactionsController.searchTransaction);

Router.patch("/", checkToken.checkToken, checkToken.adminAuth, validate.updateTransaction, transactionsController.updateTransaction);

Router.delete("/", checkToken.checkToken, checkToken.adminAuth, transactionsController.deleteTransaction);

Router.get("/MyTransactions", checkToken.checkToken, transactionsController.searchMyTransaction);

module.exports = Router;
