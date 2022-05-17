const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${file.fieldname}-${suffix}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});

const limit = {
    fileSize: 2e6,
    files: 1,
};

const imageFilter = (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const allowedExt = /jpeg|jpg|png/;
    if(!allowedExt.test(extName)){
        req.fileValidationError = {msg: "Invalid Extension"};
        cb(null, false);
    }
    cb(null, true);
    
};

const uploadImage = multer({
    storage: imageStorage,
    limits: limit,
    fileFilter: imageFilter
});

module.exports = uploadImage;