const express = require("express");
const Router = express.Router();
const authController = require("../controllers/auth");
const authValidation = require("../middleware/authValidation");
const imageUpload = require("../middleware/upload");
const validate = require("../middleware/userValidation");

//Register
Router.post("/new", imageUpload.single("picture"), validate.addNewUser, authValidation.checkRegistedEmail,  authController.register);

//Sign In
Router.post("/", authController.signIn);

//Sign Out
Router.delete("/", (req, res) => {
    res.json({
        msg: "Sign Out Success"
    });
});

module.exports = Router;