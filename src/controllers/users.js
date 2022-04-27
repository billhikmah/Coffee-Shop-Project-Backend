const {addNewUser, searchUserFromServer, updateAddressFromServer, deleteAccountFromServer} = require("../models/users");

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
    searchUserFromServer(req.body)
    .then(({data, total})=>{
        res.status(202).json({
            total,
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

const updateAddress  = (req, res) =>{
    updateAddressFromServer(req.body)
    .then(({data, message})=>{
        res.status(201).json({
            message,
            data,
        });
    })
    .catch(({error, status})=>{
        res.status(status).json(
            error
        );
    });
};

const deleteAccount  = (req, res) =>{
    deleteAccountFromServer(req.body)
    .then(({message, data})=>{
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
    postNewUser,
    searchUser,
    updateAddress,
    deleteAccount
};