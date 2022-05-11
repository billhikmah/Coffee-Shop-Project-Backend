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
        const {name, id} = body;
        let sqlQuery = "SELECT id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture FROM public.users"
        let keyword;
        if(name){
            keyword = name;
            sqlQuery += " where lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%')"
        }
        if(id){
            keyword = id;
            sqlQuery += " where id = $1"
        }
        db.query(sqlQuery, [keyword])
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

const updateUser = (body, query) => {
    return new Promise((resolve, reject) => {
        const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture} = body;
        const {id} = query;
        let sqlQuery = "UPDATE public.users set first_name = COALESCE ($1, first_name), last_name  = COALESCE ($2, last_name), display_name  = COALESCE ($3, display_name), email  = COALESCE ($4, email), password  = COALESCE ($5, password), phone  = COALESCE ($6, phone), date_of_birth  = COALESCE ($7, date_of_birth), address  = COALESCE ($8, address), sex = COALESCE ($9, sex), picture = coalesce ($10,picture) WHERE id = $11 returning *";
            db.query(sqlQuery, [first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture, id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Id Not Found!",
                        status: 400,
                    });
                }
                const response = {
                    message: "User Updated!",
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

const deleteAccountFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const {id} = query;
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
    updateUser,
    deleteAccountFromServer
};