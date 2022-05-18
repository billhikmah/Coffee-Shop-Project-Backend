const db = require("../config/db");
const bcrypt = require("bcrypt");

const addNewUser = (body) => {
    return new Promise((resolve, reject) => {
        const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture} = body;
        const sqlQuery = 'INSERT INTO public.users (first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture, created_at';
        const created_at = new Date();
        db.query(sqlQuery, [ first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture, created_at ])
        .then(({rows}) => {
            const response ={
                data: rows[0],
                message: "Account Created"
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                status: 500,
                error
            });
        });
    });
    
};

const searchUserFromServer = (query) => {
    return new Promise((resolve, reject) => {
        let {name, id, limit, page} = query;
        const offset = (page - 1)*limit;
        let sqlQuery = "SELECT id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture FROM public.users";
        let metaQuery ="select count(*) from public.users";
        let keyword;

        if(name){
            keyword = name;
            sqlQuery += " where lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%') limit $2 offset $3";
            metaQuery += " where lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%')";
        }
        if(id){
            keyword = id;
            sqlQuery += " where id = $1  limit $2 offset $3";
            metaQuery += " where id = $1";
        }
        
        return db.query(metaQuery, [keyword])
        .then((result) => { 
            const totalData = parseInt(result.rows[0].count);

            return db.query(sqlQuery, [ keyword, limit, offset ])
            .then((result) => {
                if(result.rows.length === 0){
                    return reject({
                        error: "User Not Found",
                        status: 404
                    });
                }
                
                const totalPage = totalData/limit;
                    const response = {
                        totalData,
                        totalPage: Math.ceil(totalPage),
                        totalDataOnThisPage: result.rowCount,
                        data: result.rows
                    };

                    return resolve(response);
            })
            .catch();
        })
        .catch((error) => {
            reject({
                status: 500,
                error
            });
        });
    });
    
};

const updateUser = (body, payload, picture) => {
    return new Promise((resolve, reject) => {
        const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex} = body;
        const {id} = payload;
        bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            let sqlQuery = "UPDATE public.users set first_name = COALESCE ($1, first_name), last_name  = COALESCE ($2, last_name), display_name  = COALESCE ($3, display_name), email  = COALESCE ($4, email), password  = COALESCE ($5, password), phone  = COALESCE ($6, phone), date_of_birth  = COALESCE ($7, date_of_birth), address  = COALESCE ($8, address), sex = COALESCE ($9, sex), picture = coalesce ($10, picture) WHERE id = $11 returning first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture, id";
            db.query(sqlQuery, [ first_name, last_name, display_name, email, hashedPassword, phone, date_of_birth, address, sex, picture, id ])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Id Not Found!",
                        status: 400
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
                    status: 400
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

const getUser = (payload) => {
    return new Promise((resolve, reject) => {
        const {id} = payload;
        const sqlQuery = "SELECT first_name, last_name, display_name, email, phone, date_of_birth, address, sex, picture, id, created_at FROM public.users where id = $1";
        db.query(sqlQuery, [id])
        .then((result) => {
            const data = result.rows[0];
            return resolve(data);
        })
        .catch((err) => {
            return reject({
                err,
                status: 500
            });
        });
    });
};

module.exports = {
    addNewUser,
    searchUserFromServer,
    updateUser,
    deleteAccountFromServer, 
    getUser
};
