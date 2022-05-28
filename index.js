require('dotenv').config();
const express = require("express");
const mainRouter = require("./src/routes/index");
const db = require("./src/config/db");
const server = express();
const PORT = 8080;

db.connect()
.then(() => {
    console.log("DB is connected");
    server.use(express.urlencoded({extended: false}));
    server.use(express.json());
    server.use(express.static("public"));
    server.use(mainRouter);
    server.listen(PORT, () => {
        console.log(`Server is Running at PORT ${PORT}`);
    });
})
.catch((err) => {
    console.log(err);
});
