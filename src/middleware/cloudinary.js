const {errorResponse, successResponse} = require("../helpers/response");
const cloudinary = require("../utils/cloudinary");

const uploadPicture = async (req, res, next) => {
    const picture = req.file.path;
    if(picture){
        try {
            const Response = await cloudinary.uploader.upload(picture, {folder: "public/Images"});
            req.url = Response.url;
            return next();
        } catch (error) {
            console.log("error:", error);
            errorResponse(res, 500, error);
        }
    }
};

module.exports = { uploadPicture };
