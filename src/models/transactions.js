const db = require("../config/db");

const addNewTransaction = (body) => {
    return new Promise((resolve, reject) => {
        const {id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address} = body;
        const sqlQuery = 'INSERT INTO public.transactions (id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *';
        db.query(sqlQuery, [id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address])
        .then(({rows})=>{
            const response ={
                message: "Transaction added",
                data: rows,
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

const searchTransactionsFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const {id_user} = query;
        const sqlQuery = "SELECT * FROM public.transactions where id_user = $1";
        db.query(sqlQuery, [id_user])
        .then((result) => {
            if(result.rows.length === 0){
                return reject({
                    error: "Transaction Not Found",
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

const updatePaymentMethod = (body) => {
    return new Promise((resolve, reject) => {
        const {id, id_payment_methods} = body;
        let sqlQuery = "UPDATE public.transactions SET id_payment_methods = $1 WHERE id = $2 returning *";
        db.query(sqlQuery, [id_payment_methods, id])
        .then(({rows, rowCount}) => {
            if(rowCount === 0){
                return reject({
                    error: "Transaction Not Found",
                    status: 400,
                });
            }
            const response = {
                data: rows,
                message: "Payment method updated"
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
    updatePaymentMethod,
    deleteTransactionFromServer

};