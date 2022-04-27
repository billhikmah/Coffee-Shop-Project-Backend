const {addNewProduct, searchProductFromServer, updateStock, deleteProductFromServer } = require("../models/products");

const postNewProduct  = (req, res) =>{
    addNewProduct(req.body)
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
const updateProductStock  = (req, res) =>{
    updateStock(req.body)
    .then(({message, data})=>{
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

const deleteProduct  = (req, res) =>{
    deleteProductFromServer(req.body)
    .then(({total, data, message})=>{
        res.status(200).json({
            message,
            total,
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
    postNewProduct,
    searchProduct,
    updateProductStock,
    deleteProduct
};