const {errorResponse, successResponse} = require("../helpers/response");
const cloudinary = require("../utils/cloudinary");

const uploadPicture = (req, res, next) => {
    const file = req.file;
    console.log(file);
    if(file){
        try {
            const uploadedResponse = cloudinary.uploader.upload(file, {
                upload_preset: "mf_default"
            });
            // return successResponse(res, 200, uploadedResponse);
            console.log(uploadedResponse);
            next();

            
        } catch (error) {
            console.log(error);
            errorResponse(res, 502, error);
            
        }
    }
};

module.exports = { uploadPicture };
