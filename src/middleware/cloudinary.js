const {errorResponse, successResponse} = require("../helpers/response");
const cloudinary = require("../utils/cloudinary");

const uploadPicture = async (req, res, next) => {
    const picture = req.file.path;
    if(picture){
        try {
            const uploadedResponse = await cloudinary.uploader.upload(picture,
                {
                upload_preset: "ml_default"
            }
            );
            req.url = uploadedResponse.url;
            return next();

            
        } catch (error) {
            console.log("error:", error);
            errorResponse(res, 500, error);
            
        }
    }
};

module.exports = { uploadPicture };
