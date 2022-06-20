const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET
    cloud_name: "starbillscloud",
    api_key: "763464258547458",
    api_secret: "QroR3nxJZCb0ChRNQByDdOV3Hwc"
});

module.exports = cloudinary;
