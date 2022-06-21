const db = require("../config/db");

const addNewPromo = (body, picture) => {
    return new Promise((resolve, reject) => {
        const {name, price, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code} = body;
        const sqlQuery = 'INSERT INTO public.promos (name, price, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code, picture) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
        db.query(sqlQuery, [name, price, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code, picture])
        .then(({rows}) => {
            const response ={
                message: "Promo added",
                data: rows[0]
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

const searchPromosFromServer = (query) => {
    return new Promise((resolve, reject) => {
        let {keyword = "", page = 1, limit = 5} = query;
        const offset = (page - 1)*limit;
        let sqlQuery = "SELECT * FROM public.promos where lower(name) like lower('%' || $1 || '%') or lower(coupon_code) like lower('%' || $1 || '%') limit $2 offset $3";
        let metaQuery ="select count(*) from public.promos where lower(name) like lower('%' || $1 || '%') or lower(coupon_code) like lower('%' || $1 || '%')";
        
        db.query(metaQuery, [keyword])
        .then((result) => {
            const totalData = parseInt(result.rows[0].count);

            db.query(sqlQuery, [keyword, limit, offset])
            .then((result) => {
                if(result.rows.length === 0){
                    return reject({
                        error: "Promo Not Found",
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

const updatePromo = (query, body, picture) => {
    return new Promise((resolve, reject) => {
        const {name, price, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code, product_id} = body;
        const {id} = query;
        let sqlQuery = "UPDATE public.promos set name = COALESCE ($1, name), price  = COALESCE ($2, price), description  = COALESCE ($3, description), size_id  = COALESCE ($4, size_id), delivery_method_id  = COALESCE ($5, delivery_method_id), disc  = COALESCE ($6, disc), start_date  = COALESCE ($7, start_date), end_date  = COALESCE ($8, end_date), coupon_code = COALESCE ($9, coupon_code), picture = coalesce ($10,picture), product_id = coalesce ($11, product_id) WHERE id = $12 returning *";
        db.query(sqlQuery, [name, price, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code, picture, product_id, id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Promo Id Not Found!",
                    status: 400
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
                    status: 400
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
