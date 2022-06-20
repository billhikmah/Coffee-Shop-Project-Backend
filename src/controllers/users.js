const {addNewUser, searchUserFromServer, updateUser, deleteAccountFromServer, getUser} = require("../models/users");
const {errorResponse, successResponse, searchResponse} = require("../helpers/response");

const postNewUser = (req, res) => {
    addNewUser(req.body)
    .then(({data, message}) => {
        res.status(201).json({
            message,
            data
        });
    })
    .catch(({status, error}) => {
        res.status(status).json({
            error: error.message,
            data: []
        });
    });
};
const searchUser = (req, res) => {
    searchUserFromServer(req.query)
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {name, id, limit = 5, page = 1} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/users${req.path}?limit=${limit}&page=${nextPage}`;
        let prev = `/users${req.path}?limit=${limit}&page=${prevPage}`;

        if(name){
            next += `name=${name}&`;
            prev += `name=${name}&`;
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
            next = null;
            prev = null;
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
    .catch(({status, error}) => {
        errorResponse(res, status, error);
    });
};

const updateAccount = (req, res) => {
    const payload = req.userPayload;
    const {file = null} = req;
    let picture;
    if(file){
        picture = req.url;
    }
    updateUser(req.body, payload, picture)
    .then(({data, message}) => {
        res.status(201).json({
            message,
            data
        });
    })
    .catch((err) => {
        const {error, status} = err;
        res.status(status).json({
            error
        });
    });
};

const deleteAccount = (req, res) => {
    deleteAccountFromServer(req.query)
    .then(({message, data}) => {
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
