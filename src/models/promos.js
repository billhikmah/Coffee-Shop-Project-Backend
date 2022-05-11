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
        let {keyword, id_name} = query;
        let sqlQuery = "SELECT * FROM public.promos where lower(name) like lower('%' || $1 || '%') or lower(coupon_code) like lower('%' || $1 || '%')";
        if(id_name){
            keyword = id_name
            sqlQuery = "SELECT * FROM public.promos where id_name = $1";
        }
        db.query(sqlQuery, [keyword])
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

const updatePromo = (query, body) => {
    return new Promise((resolve, reject) => {
        const {name, price, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture, id_name} = body;
        const {id} = query;
        let sqlQuery = "UPDATE public.promos set name = COALESCE ($1, name), price  = COALESCE ($2, price), description  = COALESCE ($3, description), id_size  = COALESCE ($4, id_size), id_delivery_method  = COALESCE ($5, id_delivery_method), disc  = COALESCE ($6, disc), start_date  = COALESCE ($7, start_date), end_date  = COALESCE ($8, end_date), coupon_code = COALESCE ($9, coupon_code), picture = coalesce ($10,picture), id_name = coalesce ($11, id_name) WHERE id = $12 returning *";
            db.query(sqlQuery, [name, price, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture, id_name, id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Promo Id Not Found!",
                        status: 400,
                    });
                }
                const response = {
                    message: "Promo Updated!",
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
                    error: "Promo Id Not Found",
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
    updatePromo,
    deletePromoFromServer
};