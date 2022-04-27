const express = require("express");
const Router = express.Router();
const usersController = require("../controllers/users");

Router.post("/", usersController.postNewUser);
Router.get("/search", usersController.searchUser);
Router.patch("/", usersController.updateAddress);
Router.delete("/", usersController.deleteAccount);

module.exports = Router;
