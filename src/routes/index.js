const express = require("express");
const Router = express.Router();
const productRouter = require("./products");
const promoRouter = require("./promos");
const userRouter = require("./users");
const transactionRouter = require("./transactions");

Router.use("/products", productRouter);
Router.use("/promos", promoRouter);
Router.use("/users", userRouter);
Router.use("/transactions", transactionRouter);

module.exports = Router;