const express = require("express");
const Router = express.Router();
const promosController = require("../controllers/promos");
const validate = require("../middleware/promoValidation");

Router.post("/", validate.addNewPromo, promosController.postNewPromo);
Router.get("/",  promosController.searchPromos);
Router.patch("/", validate.updatePromo, promosController.updatePromos);
Router.delete("/", promosController.deletePromo);


module.exports = Router;