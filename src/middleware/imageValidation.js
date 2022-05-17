const {errorResponse} = require("../helpers/response");

const imageValidation = (req, res, next) => {
    if(req.fileValidationError){
        return errorResponse(res, 200, req.fileValidationError);
    }
    next();
};

module.exports = {imageValidation};