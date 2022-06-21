const {addNewProduct, searchProductFromServer, updateProduct, deleteProductFromServer, getProduct} = require("../models/products");
const {errorResponse, searchResponse} = require("../helpers/response");

const postNewProduct = (req, res) => {
    const {file = null} = req;
    let picture;
    if(file){
        picture = req.url;
    }
    console.log(req.body);
    console.log(req.file);
    addNewProduct(req.body, picture)
    .then(({data}) => {
        res.status(201).json({
            message: "Product Added",
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

const searchProduct = (req, res) => {
    searchProductFromServer(req.query)
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {name, sort = "id", order = "asc", category_id, limit = 5, page = 1} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/products${req.path}?sort=${sort}&order=${order}&limit=${limit}&page=${nextPage}&`;
        let prev = `/products${req.path}?sort=${sort}&order=${order}&limit=${limit}&page=${prevPage}&`;
        if(name){
            next += `name=${name}&`;
            prev += `name=${name}&`;
        }
        if(category_id){
            next += `category_id=${category_id}`;
            prev += `category_id=${category_id}`;
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
    .catch(({error, status}) => {
        errorResponse(res, status, error);
    });
    
};
const updateProducts = (req, res) => {
    const {file} = req;
    let picture = "";
    if(file){
        picture = req.url;
    }
    const {id} = req.params;
    updateProduct(req.body, req.params, picture)
    .then(({message, data}) => {
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

const deleteProduct = (req, res) => {
    deleteProductFromServer(req.query)
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

const getOneProduct = (req, res) => {
    getProduct(req.params)
    .then(({data}) => {
        res.status(200).json({
            data
        });
    })
    .catch(({error, status}) => {
        res.status(status).json({
            error
        });
    });
};
module.exports = {
    postNewProduct,
    searchProduct,
    updateProducts,
    deleteProduct,
    getOneProduct
};
