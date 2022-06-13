const jwt = require("jsonwebtoken");
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

const checkToken = (req, res, next) => {
    const bearerToken = req.header("x-access-token");
    const token = bearerToken.split(" ")[1];
    
    if(!bearerToken){
        return errorResponse(res, 401, {msg: "Sign in needed"});
    }
    //Token Verification
    jwt.verify(token, process.env.JWT_KEY, {issuer: process.env.JWT_ISSUER}, (err, payload) => {
        if(err && err.name === "TokenExpiredError"){
            return errorResponse(res, 401, {msg: "Please sign in again"});
        }
        if(err){
            return errorResponse(res, 401, {msg: "Access denied"});
        }
        req.userPayload = payload;
        
        next();
    });
};

const adminAuth = (req, res, next) => {
    // if(req.userPayload.admin !== true){
    //     return errorResponse(res, 500, {msg: "You do not have permission to access."});
    // }
    next();
};

module.exports = {
    checkRegistedEmail,
    checkToken,
    adminAuth
};
