const {addNewTransaction, searchTransactionsFromServer, updatePaymentMethod, deleteTransactionFromServer } = require("../models/transactions");

const postNewTransaction  = (req, res) =>{
    addNewTransaction(req.body)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data,
        });
    })
    .catch(({status, error})=>{
        res.status(status).json({
            error,
            data: [],
        });
    });
};

const searchTransaction= (req, res) => {
    searchTransactionsFromServer(req.query)
    .then(({data, total}) => {
        res.status(202).json({
            total,
            data
        });
    })
    .catch(({error, status}) => {
        res.status(status).json({
            error,
            data: []
        });
    });
};

const updateTransaction  = (req, res) =>{
    updatePaymentMethod(req.body)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data
        });
    })
    .catch(({error, status})=>{
        res.status(status).json(
            error
        );
    });
};

const deleteTransaction  = (req, res) =>{
    deleteTransactionFromServer(req.body)
    .then(({data, message})=>{
        res.status(200).json({
            message,
            data
        });
    })
    .catch(({error, status})=>{
        res.status(status).json(
            error
        );
    });
};

module.exports = {
    postNewTransaction,
    searchTransaction,
    updateTransaction,
    deleteTransaction
};