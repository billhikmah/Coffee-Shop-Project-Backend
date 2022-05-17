const { successResponse, errorResponse } = require("../helpers/response");
const { registerNewUSer, getPassword, checkAdmin } = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
    const {password} = req.body;
    bcrypt.hash(password, 10)
    .then((hashedPassword) => {
        registerNewUSer(req.body, hashedPassword)
        .then(() => {
            successResponse(res, 201, {msg: "User successfully registered"}, null);
        })
        .catch((error) => {
            const {status, err} = error;
            errorResponse(res, status, err);
        });
    })
    .catch(({status, err}) =>{
        errorResponse(res, status, err);
    });
};

const signIn = (req, res) => {
    //Get body (email and password)
    const {email, password} = req.body;

    //Match email and password
    getPassword(email)
    .then((result) => {
        const id = result.id;
        bcrypt.compare(password, result.password)
        .then((result) => {
            if(!result){
                return errorResponse(res, 400, {msg: "Email or password is incorrect"});
            }
            //Generate JWT
            const userPayload = {
                email,
                id,
                user: true,
                admin: false,

            };
            const adminPayload = {
                email,
                id,
                user: true,
                admin: true,
            };
            const jwtOptions = {
                issuer: process.env.JWT_ISSUER,
                expiresIn: "300000s",
            };

            checkAdmin(email)
            .then((result) => {
                if(result === 1 && email === "admin1@starbills.com"){
                    const token = jwt.sign(adminPayload, process.env.JWT_KEY, jwtOptions);
                    return successResponse(res, 200, {email, token}, null);
                }
                const token = jwt.sign(userPayload, process.env.JWT_KEY, jwtOptions);
                successResponse(res, 200, {email, token}, null);
            })
            .catch(({err, status})=>{
                errorResponse(res, status, err);
            });
        })
        .catch((status, err) => {
            errorResponse(res, status, err);
        });
        
    })
    .catch(({status, err}) => {
        errorResponse(res, status, err);
    });
    
};

const signout = (req, res) => {
    const payload = {
        msg: "Successfully sign out"
    };
    const jwtOptions = {
        issuer: process.env.JWT_ISSUER,
        expiresIn: "1s"
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, jwtOptions);
    successResponse(res, 200, {token, msg: "Successfully sign out"}, null);
};

module.exports = {
    register,
    signIn,
    signout
};