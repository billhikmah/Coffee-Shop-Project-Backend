const {addNewPromo, searchPromosFromServer, updatePromo, deletePromoFromServer } = require("../models/promos");
const {errorResponse, successResponse, searchResponse} = require("../helpers/response");

const postNewPromo  = (req, res) =>{
    const {file = null} = req;
    let picture;
    if(file){
        picture = file.path.replace("public", "").replace(/\\/g, "/");
    }
    addNewPromo(req.body, picture)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data,
        });
    })
    .catch(({status, error})=>{
        res.status(status).json({
            error: error.message,
            data: [],
        });
    });
};

const searchPromos = (req, res) => {
    searchPromosFromServer(req.query)
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {keyword, limit, page} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/promos${req.path}?keyword=${keyword}&`;
        let prev = `/promos${req.path}?keyword=${keyword}&`;

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

const updatePromos  = (req, res) =>{
    const {file = null} = req;
    let picture;
    if(file){
        picture = file.path.replace("public", "").replace(/\\/g, "/");
    }
    updatePromo(req.query, req.body, picture)
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

const deletePromo  = (req, res) =>{
    deletePromoFromServer(req.body)
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
    postNewPromo,
    searchPromos,
    updatePromos,
    deletePromo
};