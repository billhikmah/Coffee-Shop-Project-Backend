const express = require("express");
const Router = express.Router();
const promosController = require("../controllers/promos");
const validate = require("../middleware/promoValidation");
const imageUpload = require("../middleware/upload");
const fileValidation = require("../middleware/imageValidation");
const checkToken = require("../middleware/authValidation");
const cloudinary = require("../middleware/cloudinary");

Router.post("/", checkToken.checkToken, checkToken.adminAuth, imageUpload.single("picture"), fileValidation.imageValidation, cloudinary.uploadPicture, validate.addNewPromo, promosController.postNewPromo);
Router.get("/", checkToken.checkToken, promosController.searchPromos);
Router.patch("/", checkToken.checkToken, checkToken.adminAuth, validate.updatePromo, imageUpload.single("picture"), fileValidation.imageValidation, promosController.updatePromos);
Router.delete("/", checkToken.checkToken, checkToken.adminAuth, promosController.deletePromo);


module.exports = Router;
