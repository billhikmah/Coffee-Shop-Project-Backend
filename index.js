require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mainRouter = require("./src/routes/index");
const db = require("./src/config/db");
const server = express();
const PORT = process.env.PORT || 8080;
const logger = require("morgan");
const bodyParser = require("body-parser");
const upload = require("./src/middleware/upload");
const cloudinary = require("./src/middleware/cloudinary");
const fs = require("fs");

db.connect()
.then(() => {
    console.log("DB is connected");
    server.use(
        logger(":method :url :status :res[content-length] - :response-time ms"));
    const corsOptions = {
        origin: ["http://localhost:3000", "https://starbills.netlify.app"],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-access-token"]
    };
    server.use("*", cors(corsOptions));
    // server.use(bodyParser.urlencoded({extended:false}));
    server.use(express.urlencoded({extended: false}));
    server.use(express.json());
    server.use(express.static("public"));
    server.use(mainRouter);
    server.listen(PORT, () => {
        console.log(`Server is Running at PORT ${PORT}`);
    });
    server.use("/upload-images", upload.array("image"), async (req, res) => {

        const uploader = async (path) => {
            await cloudinary.upload("image", path)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
            // if(req.method === "POST"){
            //     const urls = [];
            //     const files = req.files;
            //     for(const file of files){
            //         const {path} = file;
            //         const newPath = await uploader(path);
    
            //         urls.push(newPath);
            //         fs.unlinkSync(path);
            //     }
            //     res.status(200).json({
            //         msg: "Image upload successfully",
            //         data: urls
            //     });
            // } else {
            //     res.status(405).json({
            //         err: "image not uploaded"
            //     });
            // }
        };
    });
})
.catch((err) => {
    console.log(err);
});
