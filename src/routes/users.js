const express = require("express");
const Router = express.Router();
const usersController = require("../controllers/users");
const validate = require("../middleware/userValidation");
const token = require("../middleware/authValidation");
const imageUpload = require("../middleware/upload");

Router.post("/", imageUpload.single("picture"), validate.addNewUser, usersController.postNewUser);
Router.get("/search", usersController.searchUser);
Router.patch("/", imageUpload.single("picture"), token.checkToken, validate.updateUser, usersController.updateAccount);
Router.delete("/", usersController.deleteAccount);
Router.get("/myProfile", token.checkToken, usersController.checkProfile);

module.exports = Router;
