const express = require("express");
const Router = express.Router();
const productsController = require("../controllers/products");
const validate = require("../middleware/productValidation");

Router.post("/", validate.addNewProduct, productsController.postNewProduct);
Router.get("/", validate.searchProduct, productsController.searchProduct);
Router.patch("/", validate.updateProduct, productsController.updateProducts);
Router.delete("/", productsController.deleteProduct);

module.exports = Router;