const db = require("../config/db");
// const bcrypt = require("bcrypt");
// const { reject } = require("bcrypt/promises");

const getEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "SELECT email from public.users where email = $1";
        db.query(sqlQuery, [email])
        .then((result) => {
            resolve(result);
        })
        .catch((err) => {
            reject({status:500, err});
        })
    })
    
};

const registerNewUSer = (body, password) => {
    return new Promise ((resolve, reject) => {
        const {first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture} = body;
        
        const sqlQuery = "INSERT INTO public.users (first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);"
            const created_at = new Date(Date.now())
            const values = [first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture, created_at];
            db.query(sqlQuery, values)
            .then(() => {
                resolve ()
            })
            .catch((err) => {
                reject({status:500, err})
            });
    })
}

const getPassword = (email) => {
    return new Promise ((resolve, reject) => {
        const sqlQuery = "select password from public.users where email = $1";
        db.query(sqlQuery, [email])
        .then((result) => {
            if(result.rowCount === 0){
                return reject({status: 400, err: {msg: "Email or password is incorrect"}})
            }
            return resolve(result.rows[0]);
        })
        .catch((err) => {
            reject({status: 500, err})
        })
    })
    
}



module.exports = {
    registerNewUSer,
    getEmail,
    getPassword
}