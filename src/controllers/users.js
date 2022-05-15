const {addNewUser, searchUserFromServer, updateUser, deleteAccountFromServer, getUser} = require("../models/users");
const {errorResponse, successResponse} = require("../helpers/response");

const postNewUser  = (req, res) =>{
    addNewUser(req.body)
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
const searchUser  = (req, res) =>{
    searchUserFromServer(req.query)
    .then((result)=>{
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {name, id, limit, page} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/users${req.path}?`;
        let prev = `/users${req.path}?`;

        if(name){
            next += `name=${name}&`;
            prev += `name=${name}&`;
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
            return successResponse(res, 202, data, meta);
        }
        if(parseInt(page) === totalPage && totalPage !== 1){
            const meta = {
                totalData,
                totalDataOnThisPage,
                totalPage,
                page: parseInt(req.query.page),
                prev
            };
            return successResponse(res, 202, data, meta);
        }
        if(totalPage === 1){
            const meta = {
                totalData,
                totalDataOnThisPage,
                totalPage,
                page: parseInt(req.query.page)
            };
            return successResponse(res, 202, data, meta);
        }
        const meta = {
            totalData,
            totalDataOnThisPage,
            totalPage,
            page: parseInt(req.query.page),
            next,
            prev
        };
        successResponse(res, 202, data, meta);
    })
    .catch(({status, error})=>{
        errorResponse(res, status, error);
    });
};

const updateAccount  = (req, res) =>{
    updateUser(req.body, req.userPayload)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data,
        });
    })
    .catch(({error, status})=>{
        res.status(status).json({
            error
        });
    });
};

const deleteAccount  = (req, res) =>{
    deleteAccountFromServer(req.query)
    .then(({message, data})=>{
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

const checkProfile = (req, res) => {
    getUser(req.userPayload)
    .then((result) => {
        successResponse(res, 202, result, null);
    })
    .catch((err) => {
        errorResponse(res, 500, err);
    });

};

module.exports = {
    postNewUser,
    searchUser,
    updateAccount,
    deleteAccount, 
    checkProfile
};