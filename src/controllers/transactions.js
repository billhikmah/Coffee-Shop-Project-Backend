const {addNewTransaction, searchTransactionsFromServer, changeTransaction, deleteTransactionFromServer } = require("../models/transactions");
const {errorResponse, successResponse, searchResponse} = require("../helpers/response");

const postNewTransaction  = (req, res) =>{
    addNewTransaction(req.body, req.query)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data,
        });
    })
    .catch(({status, error})=>{
        errorResponse(res, status, error);
    });
};

const searchTransaction= (req, res) => {
    searchTransactionsFromServer(req.query)
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {id, id_user, limit, page} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/transactions${req.path}?`;
        let prev = `/transactions${req.path}?`;

        if(id_user){
            next += `id_user=${id_user}&`;
            prev += `id_user=${id_user}&`;
        }
        if(id){
            next += `sort=${id}&`;
            prev += `sort=${id}&`;
        }
        if(limit){
            next += `limit=${limit}&`;
            prev += `limit=${limit}&`;
        }
        if(page){
            next += `page=${nextPage}`;
            prev += `page=${prevPage}`;
        }
        if(parseInt(page) === 1 && totalPage !== 1){
            const meta = {
                totalData,
                totalDataOnThisPage,
                totalPage,
                page: parseInt(req.query.page),
                next,
            };
            return searchResponse(res, 202, data, meta);
        }
        if(parseInt(page) === totalPage && totalPage !== 1){
            const meta = {
                totalData,
                totalDataOnThisPage,
                totalPage,
                page: parseInt(req.query.page),
                prev
            };
            return searchResponse(res, 202, data, meta);
        }
        if(totalPage === 1){
            const meta = {
                totalData,
                totalDataOnThisPage,
                totalPage,
                page: parseInt(req.query.page)
            };
            return searchResponse(res, 202, data, meta);
        }
        const meta = {
            totalData,
            totalDataOnThisPage,
            totalPage,
            page: parseInt(req.query.page),
            next,
            prev
        };
        searchResponse(res, 202, data, meta);
        })
    .catch(({error, status}) => {
        errorResponse(res, status, error);
        
    });
};

const updateTransaction  = (req, res) =>{
    changeTransaction(req.body, req.query)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data
        });
    })
    .catch(({error, status})=>{
        res.status(status).json({
            error
        });
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
        res.status(status).json({
            error
        });
    });
};

module.exports = {
    postNewTransaction,
    searchTransaction,
    updateTransaction,
    deleteTransaction
};