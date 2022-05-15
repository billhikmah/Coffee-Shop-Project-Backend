const express = require("express");
const Router = express.Router();
const promosController = require("../controllers/promos");
const validate = require("../middleware/promoValidation");
const imageUpload = require("../middleware/upload");

Router.post("/", imageUpload.single("picture"), validate.addNewPromo, promosController.postNewPromo);
Router.get("/",  promosController.searchPromos);
Router.patch("/", validate.updatePromo, imageUpload.single("picture"), promosController.updatePromos);
Router.delete("/", promosController.deletePromo);


module.exports = Router;