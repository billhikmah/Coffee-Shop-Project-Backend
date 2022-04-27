const express = require("express");
const Router = express.Router();
const productsController = require("../controllers/products");
const validate = require("../middleware/validate");

Router.post("/", validate.addNewProduct, productsController.postNewProduct);
Router.get("/", validate.searchNewProduct, productsController.searchProduct);
Router.patch("/", productsController.updateProductStock);
Router.delete("/", productsController.deleteProduct);

module.exports = Router;