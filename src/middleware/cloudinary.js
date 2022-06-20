const {errorResponse, successResponse} = require("../helpers/response");
const cloudinary = require("../utils/cloudinary");

const uploadPicture = async (req, res, next) => {
    if(req.file){
        const picture = req.file.path;
        if(picture){
            try {
                const response = await cloudinary.uploader.upload(picture, {folder: "public"});
                console.log(response);
                req.url = response.url;
                return next();
            } catch (error) {
                console.log("error:", error);
                errorResponse(res, 500, error);
            }
        }
    }
};

module.exports = { uploadPicture };
