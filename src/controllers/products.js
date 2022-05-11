const {addNewProduct, searchProductFromServer, updateProduct, deleteProductFromServer } = require("../models/products");

const postNewProduct  = (req, res) =>{
    addNewProduct(req.query)
    .then(({data})=>{
        res.status(201).json({
            message: "Product Added",
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

const searchProduct = (req, res) => {
    searchProductFromServer(req.query)
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
const updateProducts  = (req, res) =>{
    updateProduct(req.body, req.query)
    .then(({message, data})=>{
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

const deleteProduct  = (req, res) =>{
    deleteProductFromServer(req.query)
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
    postNewProduct,
    searchProduct,
    updateProducts,
    deleteProduct
};