const express = require("express");
const Router = express.Router();
const productRouter = require("./products");
const promoRouter = require("./promos");
const userRouter = require("./users");
const transactionRouter = require("./transactions");
const authRouter = require("./auth");

Router.use("/products", productRouter);
Router.use("/promos", promoRouter);
Router.use("/users", userRouter);
Router.use("/transactions", transactionRouter);
Router.use("/auth", authRouter);

module.exports = Router;