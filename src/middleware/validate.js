const searchProduct = (req, res, next) => {
    const {name, id_category, sort, order} = req.query;
    if(typeof name !== "string"){
        return res.status(400).json({
            error: "Invalid input name!"
        });
    }
    if( id_category !== "1" && id_category !== "2" && id_category !== "3"){
        return res.status(400).json({
            error: "Invalid input id_category!"
        });
    }
    if(sort !== "price" && sort !== "input_time"){
        return res.status(400).json({
            error: "Invalid input sort!"
        });
    }
    if( order !== "asc" && order !== "desc"){
        return res.status(400).json({
            error: "Invalid input order!"
        });
    }
    next();
};

const addNewProduct = (req, res, next) => {
    const validateBody = Object.keys(req.body).filter(
        (key) =>
            key === "name" || key === "price" || key === "id_category" ||
            key === "id_delivery_method" || key === "id_size" || key === "stock"
    );

    if(validateBody.length < 6){
        return res.status(400).json({
            error: "New product input must contain name, id_size, price, id_category, id_delivery_method, and stock",
            added_input: validateBody,
        });
    }
    next();
};

module.exports = {
    addNewProduct,
    searchProduct
};