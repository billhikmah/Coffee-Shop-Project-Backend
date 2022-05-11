const {errorResponse} = require("../helpers/response");
const {getEmail} = require("../models/auth");

const checkRegistedEmail = (req, res, next) => {
    getEmail(req.body.email)
    .then((result) => {
        if(result.rowCount !== 0){
            return errorResponse(res, 400, {msg: "Email is already registered"});
        }
        next();
    })
    .catch((error) => {
        const {status, err} = error;
        errorResponse(res, status, err);
    });
};

module.exports = {
    checkRegistedEmail
};