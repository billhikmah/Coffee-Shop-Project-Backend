const express = require("express");
const Router = express.Router();
const authController = require("../controllers/auth");
const authValidation = require("../middleware/authValidation");

//Register
Router.post("/new", authValidation.checkRegistedEmail, authController.register);

//Sign In
Router.post("/", authController.signIn);

//Sign Out
Router.delete("/", (req, res) => {
    res.json({
        msg: "Sign Out Success"
    });
});

module.exports = Router;