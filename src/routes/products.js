const express = require("express");
const Router = express.Router();
const productsController = require("../controllers/products");
const validate = require("../middleware/productValidation");
const imageUpload = require("../middleware/upload");
const fileValidation = require("../middleware/imageValidation");
const checkToken = require("../middleware/authValidation");
const cloudinary = require("../middleware/cloudinary");

Router.post("/", checkToken.checkToken, checkToken.adminAuth, imageUpload.single("picture"), fileValidation.imageValidation, cloudinary.uploadPicture, validate.addNewProduct, productsController.postNewProduct);
Router.get("/", validate.searchProduct, productsController.searchProduct);
Router.patch("/:id/", checkToken.checkToken, checkToken.adminAuth, imageUpload.single("picture"), fileValidation.imageValidation, cloudinary.uploadPicture, validate.updateProduct, productsController.updateProducts);
Router.delete("/", checkToken.checkToken, checkToken.adminAuth, productsController.deleteProduct);
Router.get("/details/:id", productsController.getOneProduct);

module.exports = Router;
