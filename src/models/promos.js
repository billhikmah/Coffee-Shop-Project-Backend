const db = require("../config/db");

const addNewPromo = (body) => {
    return new Promise((resolve, reject) => {
        const {name, price, id_name, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture} = body;
        const sqlQuery = 'INSERT INTO public.promos (name, price, id_name, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING *';
        db.query(sqlQuery, [name, price, id_name, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture])
        .then(({rows})=>{
            const response ={
                message: "Promo added",
                data: rows[0],
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

const searchPromosFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const name = query.name;
        const sqlQuery = "SELECT * FROM public.promos where lower(name) like lower('%' || $1 || '%')";
        db.query(sqlQuery, [name])
        .then((result) => {
            if(result.rows.length === 0){
                return reject({
                    error: "Promo Not Found",
                    status: 404,
                });
            }
            const response = {
                total: result.rowCount,
                data: result.rows
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

const updateDateEnd = (body) => {
    return new Promise((resolve, reject) => {
        const {id, end_date} = body;
        let sqlQuery = "UPDATE public.promos SET end_date = $1 WHERE id = $2 returning *";
        db.query(sqlQuery, [end_date, id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Promo Not Found",
                    status: 400,
                });
            }
            const response = {
                message: "Date updated!",
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

const deletePromoFromServer = (body) => {
    return new Promise((resolve, reject) => {
        const {id} = body;
        let sqlQuery = "DELETE FROM public.promos WHERE id= $1 returning *;";
        db.query(sqlQuery, [id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Promo Not Found",
                    status: 400,
                });
            }
            const response = {
                message: "Promo deleted",
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
    addNewPromo,
    searchPromosFromServer,
    updateDateEnd,
    deletePromoFromServer
};