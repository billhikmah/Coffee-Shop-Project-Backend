const db = require("../config/db");
const bcrypt = require("bcrypt");

const addNewUser = (body) => {
    return new Promise((resolve, reject) => {
        const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex_id, picture} = body;
        const sqlQuery = 'INSERT INTO public.users (first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex_id, picture, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex_id, picture, created_at';
        const created_at = new Date();
        db.query(sqlQuery, [first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex_id, picture, created_at])
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
        let {name = "", id, limit = 5, page = 1} = query;
        const offset = (page - 1)*limit;
        let sqlQuery = "SELECT id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex_id, picture FROM public.users where lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%') limit $2 offset $3";
        let metaQuery ="select count(*) from public.users where lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%')";
        let sqlQueryValues= [name, limit, offset];
        let metaQueryValues = [name];

        if(id){
            sqlQuery = "SELECT id, first_name, last_name, display_name, email, phone, date_of_birth, address, sex_id, picture FROM public.users where id = $1 limit $2 offset $3";
            metaQuery = "select count(*) from public.users where id = $1";
            sqlQueryValues= [id, limit, offset];
            metaQueryValues = [id];
        }

        return db.query(metaQuery, metaQueryValues)
        .then((result) => { 
            const totalData = parseInt(result.rows[0].count);
            return db.query(sqlQuery, sqlQueryValues)
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
        const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex_id} = body;
        const {id} = payload;

        bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            let sqlQuery = "UPDATE public.users set first_name = COALESCE ($1, first_name), last_name  = COALESCE ($2, last_name), display_name  = COALESCE ($3, display_name), email  = COALESCE ($4, email), password  = COALESCE ($5, password), phone  = COALESCE ($6, phone), date_of_birth  = COALESCE ($7, date_of_birth), address  = COALESCE ($8, address), sex_id = COALESCE ($9, sex_id), picture = coalesce ($10, picture) WHERE id = $11 returning first_name, last_name, display_name, email, phone, date_of_birth, address, sex_id, picture, id";
            db.query(sqlQuery, [first_name, last_name, display_name, email, hashedPassword, phone, date_of_birth, address, sex_id, picture, id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Id Not Found!",
                        status: 400
                    });
                }
                const response = {
                    message: "User Updated",
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
        const sqlQuery = "SELECT first_name, last_name, display_name, email, phone, date_of_birth, address, sex_id, picture, id, created_at, password FROM public.users where id = $1";
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
