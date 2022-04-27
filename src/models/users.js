const db = require("../config/db");

const addNewUser = (body) => {
    return new Promise((resolve, reject) => {
        const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture} = body;
        const sqlQuery = 'INSERT INTO public.users (first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture';
        db.query(sqlQuery, [first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture])
        .then(({rows})=>{
            const response ={
                data: rows[0],
                message: "Account Created"
            };
            resolve(response);
        })
        .catch((error)=>{
            reject({
                status: 500,
                error,
            });
        });
    });
    
};

const searchUserFromServer = (body) => {
    return new Promise((resolve, reject) => {
        const {name} = body;
        const sqlQuery = "SELECT id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture FROM public.users where lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%')";
        db.query(sqlQuery, [name])
        .then(({rows, rowCount})=>{
            if(rows.length === 0){
                return reject({
                    error: "User Not Found",
                    status: 404,
                });
            }
            const response ={
                data: rows,
                total: rowCount
            };
            resolve(response);
        })
        .catch((error)=>{
            reject({
                status: 500,
                error,
            });
        });
    });
    
};

const updateAddressFromServer = (body) => {
    return new Promise((resolve, reject) => {
        const {id, address} = body;
        let sqlQuery = "UPDATE users SET address = $1 WHERE id = $2 returning first_name, last_name, address";
        db.query(sqlQuery, [address, id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Account Not Found",
                    status: 400,
                });
            }
            const response = {
                data: rows,
                message: "Address updated"
            };
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const deleteAccountFromServer = (body) => {
    return new Promise((resolve, reject) => {
        const {id} = body;
        let sqlQuery = "DELETE FROM public.users WHERE id= $1 returning *";
        db.query(sqlQuery, [id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Account Not Found",
                    status: 400,
                });
            }
            const response = {
                message: "Account deleted",
                data: rows
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                error,
                status: 500
            });
        });
    });
};

module.exports = {
    addNewUser,
    searchUserFromServer,
    updateAddressFromServer,
    deleteAccountFromServer
};