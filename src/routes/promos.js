const express = require("express");
const Router = express.Router();
const promosController = require("../controllers/promos");

Router.post("/", promosController.postNewPromo);
Router.get("/", promosController.searchPromos);
Router.patch("/", promosController.updateDate);
Router.delete("/", promosController.deletePromo);


module.exports = Router;