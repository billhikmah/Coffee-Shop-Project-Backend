const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const {errorResponse, successResponse} = require("../helpers/response");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.COUDINARY_API_KEY,
    api_secre: process.env.CLOUDINARY_API_SECRET
});

const uploadPicture = async (req, res) => {
    const {file = null} = req;
    if(file){
        try {
            const uploadedResponse = await cloudinary.uploader.upload(file, {
                upload_preset: "dev_setups"
            });
            successResponse(res, 200, uploadedResponse);
            
        } catch (error) {
            errorResponse(res, 500, error);
            
        }
    }
    // return new Promise((resolve) => {
    //     cloudinary.uploader.upload(file, (result) => {
    //         resolve({
    //             url: result.url,
    //             id: result.public_id
    //         });
    //     }, {
    //         resource_type: "auto",
    //         folder: folder
    //     });
    // });
};

module.exports = {uploadPicture};
