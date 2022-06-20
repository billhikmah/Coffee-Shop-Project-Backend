const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secre: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
