const {addNewTransaction, searchTransactionsFromServer, changeTransaction, deleteTransactionFromServer } = require("../models/transactions");
const {errorResponse, searchResponse} = require("../helpers/response");

const postNewTransaction = (req, res) => {
    addNewTransaction(req.body, req.query)
    .then(({data, message}) => {
        res.status(201).json({
            message,
            data
        });
    })
    .catch(({status, error}) => {
        errorResponse(res, status, error);
    });
};

const searchTransaction= (req, res) => {
    searchTransactionsFromServer(req.query, req.query.user_id)
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {id, user_id, limit = 5, page = 1} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/transactions${req.path}?limit=${limit}&page=${nextPage}`;
        let prev = `/transactions${req.path}?limit=${limit}&page=${prevPage}`;

        if(user_id){
            next += `user_id=${user_id}&`;
            prev += `user_id=${user_id}&`;
        }
        if(id){
            next += `sort=${id}&`;
            prev += `sort=${id}&`;
        }
        if(parseInt(page) === 1 && totalPage !== 1){
            prev = null;
        }
        if(parseInt(page) === totalPage && totalPage !== 1){
            next = null;
        }
        if(totalPage === 1){
            next =null;
            prev= null;
        }
        const meta = {
            totalData,
            totalDataOnThisPage,
            totalPage,
            page,
            next,
            prev
        };
        searchResponse(res, 202, data, meta);
        })
    .catch(({error, status}) => {
        errorResponse(res, status, error);
        
    });
};

const updateTransaction = (req, res) => {
    changeTransaction(req.body, req.query)
    .then(({data, message}) => {
        res.status(201).json({
            message,
            data
        });
    })
    .catch(({error, status}) => {
        res.status(status).json({
            error
        });
    });
};

const deleteTransaction = (req, res) => {
    deleteTransactionFromServer(req.body)
    .then(({data, message}) => {
        res.status(200).json({
            message,
            data
        });
    })
    .catch(({error, status}) => {
        res.status(status).json({
            error
        });
    });
};

const searchMyTransaction = (req, res) => {
    searchTransactionsFromServer(req.query, req.userPayload.id)
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {limit = 5, page = 1} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/transactions${req.path}?limit=${limit}&page=${nextPage}`;
        let prev = `/transactions${req.path}?limit=${limit}&page=${prevPage}`;

        if(parseInt(page) === 1 && totalPage !== 1){
            prev = null;
        }
        if(parseInt(page) === totalPage && totalPage !== 1){
            next = null;
        }
        if(totalPage === 1){
            prev = null;
            next = null;
        }
        const meta = {
            totalData,
            totalDataOnThisPage,
            totalPage,
            page: parseInt(page),
            next,
            prev
        };
        searchResponse(res, 202, data, meta);
        })
    .catch(({error, status}) => {
        errorResponse(res, status, error);
        
    });
};

module.exports = {
    postNewTransaction,
    searchTransaction,
    updateTransaction,
    deleteTransaction,
    searchMyTransaction
};
