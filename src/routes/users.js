const express = require("express");
const Router = express.Router();
const usersController = require("../controllers/users");
const validate = require("../middleware/userValidation")

Router.post("/", validate.addNewUser, usersController.postNewUser);
Router.get("/search", usersController.searchUser);
Router.patch("/",validate.updateUser, usersController.updateAccount);
Router.delete("/", usersController.deleteAccount);

module.exports = Router;
