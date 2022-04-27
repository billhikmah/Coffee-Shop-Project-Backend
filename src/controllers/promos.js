const {addNewPromo, searchPromosFromServer, updateDateEnd, deletePromoFromServer } = require("../models/promos");

const postNewPromo  = (req, res) =>{
    addNewPromo(req.body)
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

const updateDate  = (req, res) =>{
    updateDateEnd(req.body)
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

const deletePromo  = (req, res) =>{
    deletePromoFromServer(req.body)
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
    postNewPromo,
    searchPromos,
    updateDate,
    deletePromo
};