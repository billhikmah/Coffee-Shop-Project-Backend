const express = require("express");
const Router = express.Router();
const productsController = require("../controllers/products");
const validate = require("../middleware/productValidation");
const imageUpload = require("../middleware/upload");
const fileValidation = require("../middleware/imageValidation");

Router.post("/", imageUpload.single("picture"), fileValidation.imageValidation, validate.addNewProduct, productsController.postNewProduct);
Router.get("/", validate.searchProduct, productsController.searchProduct);
Router.patch("/", imageUpload.single("picture"), fileValidation.imageValidation, validate.updateProduct, productsController.updateProducts);
Router.delete("/", productsController.deleteProduct);

module.exports = Router;