const express = require("express");
const Router = express.Router();
const usersController = require("../controllers/users");
const validate = require("../middleware/userValidation");
const checkToken = require("../middleware/authValidation");
const imageUpload = require("../middleware/upload");
const fileValidation = require("../middleware/imageValidation");
const cloudinary = require("../middleware/cloudinary");

Router.post("/", checkToken.checkToken, checkToken.adminAuth, imageUpload.single("picture"), fileValidation.imageValidation, validate.addNewUser, usersController.postNewUser);
Router.get("/search", checkToken.checkToken, checkToken.adminAuth, usersController.searchUser);
Router.patch("/", checkToken.checkToken, imageUpload.single("picture"), cloudinary.uploadPicture, fileValidation.imageValidation, validate.updateUser, usersController.updateAccount);
Router.delete("/", checkToken.checkToken, checkToken.adminAuth, usersController.deleteAccount);
Router.get("/myProfile", checkToken.checkToken, usersController.checkProfile);

module.exports = Router;
