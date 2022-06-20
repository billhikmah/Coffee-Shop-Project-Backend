const {errorResponse, successResponse} = require("../helpers/response");
const cloudinary = require("../utils/cloudinary");

const uploadPicture = async (req, res, next) => {
    const picture = req.file;
    console.log(picture);
    if(picture){
        try {
            const uploadedResponse = await cloudinary.uploader.upload(picture, {
                upload_preset: "mf_default"
            });
            // return successResponse(res, 200, uploadedResponse);
            console.log("success", uploadedResponse);
            next();

            
        } catch (error) {
            console.log("error:", error);
            errorResponse(res, 502, error);
            
        }
    }
};

module.exports = { uploadPicture };
