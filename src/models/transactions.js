const db = require("../config/db");

const addNewTransaction = (body, query) => {
    return new Promise((resolve, reject) => {
        const {id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address} = body;
        const {id_user} = query;
        const sqlQuery = 'INSERT INTO public.transactions (id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *';
        db.query(sqlQuery, [id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address])
        .then(({rows})=>{
            const response ={
                message: "Transaction added",
                data: rows,
            };
            return resolve(response);
        })
        .catch((error)=>{
            return reject({
                status: 500,
                error,
            });
        });
    });
    
};

const searchTransactionsFromServer = (query, id_user) => {
    return new Promise((resolve, reject) => {
        let { id, limit, page} = query;
        const offset = (page - 1)*limit;
        let key;
        let sqlQuery = "SELECT * FROM public.transactions";
        let metaQuery ="select count(*) from public.transactions";
        
        if(id_user){
            key = id_user;
            sqlQuery += " where id_user = $1 limit $2 offset $3";
            metaQuery += " where id_user = $1";
        }
        if(id){
            key = id;
            sqlQuery += " where id = $1 limit $2 offset $3";
            metaQuery += " where id = $1";
        }

        return db.query(metaQuery, [key])
        .then((result) => {
            const totalData = parseInt(result.rows[0].count);

            return db.query(sqlQuery, [key, limit, offset])
                .then((result) => {
                    if(result.rows.length === 0){
                        return reject({
                            error: "Transaction Not Found",
                            status: 404,
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
                        status: 501
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

const changeTransaction = (body, query) => {
    return new Promise((resolve, reject) => {
        const {id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address} = body;
        const {id} = query;
        let sqlQuery = "UPDATE public.transactions set id_user = COALESCE ($1, id_user), id_product  = COALESCE ($2, id_product), qty  = COALESCE ($3, qty), id_total  = COALESCE ($4, id_total), id_delivery  = COALESCE ($5, id_delivery), time  = COALESCE ($6, time), date  = COALESCE ($7, date), id_payment_methods  = COALESCE ($8, id_payment_methods), address = COALESCE ($9, address) WHERE id = $10 returning *";
            db.query(sqlQuery, [id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address, id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Id Not Found!",
                        status: 400,
                    });
                }
                const response = {
                    message: "Transaction Updated!",
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

const deleteTransactionFromServer = (body) => {
    return new Promise((resolve, reject) => {
        const {id} = body;
        let sqlQuery = "DELETE FROM public.transactions WHERE id= $1 returning *;";
        db.query(sqlQuery, [id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Transaction Not Found",
                    status: 400,
                });
            }
            const response = {
                message: "Transaction deleted",
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
    addNewTransaction,
    searchTransactionsFromServer,
    changeTransaction,
    deleteTransactionFromServer

};