const db = require("../config/db");

const addNewTransaction = (body, query) => {
    return new Promise((resolve, reject) => {
        const {product_id, qty, total_price, delivery_method_id, payment_method_id, address} = body;
        const {user_id} = query;
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const sqlQuery = 'INSERT INTO public.transactions (user_id, product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *';
        db.query(sqlQuery, [user_id, product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, address])
        .then(({rows}) => {
            const response ={
                message: "Transaction added",
                data: rows
            };
            return resolve(response);
        })
        .catch((error) => {
            return reject({
                status: 500,
                error
            });
        });
    });
    
};

const searchTransactionsFromServer = (query, user_id) => {
    return new Promise((resolve, reject) => {
        let { id, limit = 5, page = 1} = query;
        const offset = (page - 1)*limit;
        let key = [];
        let metaKey = [];
        let sqlQuery = "SELECT * FROM public.transactions";
        let metaQuery ="select count(*) from public.transactions";
        
        if(user_id){
            metaKey = [user_id];
            key = [user_id, limit, offset];
            sqlQuery += " where user_id = $1 order by date desc, time desc limit $2 offset $3";
            metaQuery += " where user_id = $1";
        }
        if(id){
            metaKey = [id];
            key = [id, limit, offset];
            sqlQuery += " where id = $1 order by date desc, time desc limit $2 offset $3";
            metaQuery += " where id = $1";
        }
        return db.query(metaQuery, metaKey)
        .then((result) => {
            const totalData = parseInt(result.rows[0].count);

            return db.query(sqlQuery, key)
                .then((result) => {
                    if(result.rows.length === 0){
                        return reject({
                            error: "Transaction Not Found",
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
        const {user_id, product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, address} = body;
        const {id} = query;
        let sqlQuery = "UPDATE public.transactions set user_id = COALESCE ($1, user_id), product_id  = COALESCE ($2, product_id), qty  = COALESCE ($3, qty), total_price  = COALESCE ($4, total_price), delivery_method_id  = COALESCE ($5, delivery_method_id), time  = COALESCE ($6, time), date  = COALESCE ($7, date), payment_method_id  = COALESCE ($8, payment_method_id), address = COALESCE ($9, address) WHERE id = $10 returning *";
            db.query(sqlQuery, [user_id, product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, address, id])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Id Not Found!",
                        status: 400
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
                    status: 400
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
