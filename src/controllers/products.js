const {addNewProduct, searchProductFromServer, updateProduct, deleteProductFromServer } = require("../models/products");
const {errorResponse, searchResponse} = require("../helpers/response");

const postNewProduct  = (req, res) =>{
    const {file} = req;
    let picture;
    if(file){
        picture = file.path.replace("public", "").replace(/\\/g, "/");
    }
    addNewProduct(req.body, picture)
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
    .then((result) => {
        const{totalData, totalPage, totalDataOnThisPage, data } = result; 
        const {name, sort, order, id_category, limit, page} = req.query;
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;

        let next = `/products${req.path}?`;
        let prev = `/products${req.path}?`;
        if(name){
            next += `name=${name}&`;
            prev += `name=${name}&`;
        }
        if(sort){
            next += `sort=${sort}&`;
            prev += `sort=${sort}&`;
        }
        if(order){
            next += `order=${order}&`;
            prev += `order=${order}&`;
        }
        if(id_category){
            next += `id_category=${id_category}&`;
            prev += `id_category=${id_category}&`;
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
const updateProducts  = (req, res) =>{
    const {file} = req;
    let picture = "";
    if(file){
        picture = file.path.replace("public", "").replace(/\\/g, "/");
    }
    const {id} = req.params;
    console.log(id);
    updateProduct(req.body, req.params, picture)
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