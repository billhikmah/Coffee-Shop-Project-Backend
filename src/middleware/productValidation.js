const searchProduct = (req, res, next) => {
    const {name, id_category, sort, order} = req.query;
    if(name){
        if(typeof name !== "string"){
            return res.status(400).json({
                error: "Invalid input name!"
            });
        }
    }
    if(id_category){
        if( id_category !== "1" && id_category !== "2" && id_category !== "3"){
            return res.status(400).json({
                error: "Invalid input id_category!"
            });
        }
    }
    if(sort){
        if(sort !== "price" && sort !== "input_time" && sort !== "favorites" && sort !== "id"){
            return res.status(400).json({
                error: "Invalid input sort!"
            });
        }
    }
    if(order){
        if( order !== "asc" && order !== "desc"){
            return res.status(400).json({
                error: "Invalid input order!"
            });
        }      
    }
    next();
};

const addNewProduct = (req, res, next) => {
    const {name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture} = req.body;
    const validateQuery = Object.keys(req.body).filter(
        (key) => {
return key === "name" || key === "price" || key === "id_category" ||
            key === "id_delivery_method" || key === "id_size" || key === "stock";
}
    );

    if(validateQuery.length < 6){
        return res.status(400).json({
            error: "New product input must contain name, id_size, price, id_category, id_delivery_method, and stock",
            added_input: validateQuery
        });
    }
    if(name.length >= 40){
        return res.status(400).json({
            error: "Name cannot be longer than 40 characters!"
        });
    }
    if(id_size < 1 || id_size > 7){
        return res.status(400).json({
            error: "Invalid input id_size!"
        });
    }
    if(price.length > 6){
        return res.status(400).json({
            error: "Price cannot be longer than 6 characters!"
        });
    }
    if(id_category < 1 || id_category > 3){
        return res.status(400).json({
            error: "Invalid input id_category!"
        });
    }
    if(description){
        if(description.length >= 120){
            return res.status(400).json({
                error: "Description cannot be longer than 120 characters!"
            });
        }
    }
    if(id_delivery_method < 1 || id_delivery_method > 3){
        return res.status(400).json({
            error: "Invalid input id_delivery_method!"
        });
    }
    next();
};

const updateProduct = (req, res, next) => {
    const {name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture} = req.body;
    const {file} = req;

    if(name){
        if(name.length > 40){
            return res.status(400).json({
                error: "Name cannot be longer than 40 characters!"
            });
        }
    }
    if(id_size){
        if(id_size < 1 || id_size > 7){
            return res.status(400).json({
                error: "Invalid input id_size!"
            });
        }
    }
    if(price){
        if(price.length > 6){
            return res.status(400).json({
                error: "Price cannot be longer than 6 characters!"
            });
        }
    }
    if(id_category){
        if(id_category < 1 || id_category > 3){
            return res.status(400).json({
                error: "Invalid input id_category!"
            });
        }
    }
    if(description){
        if(description){
            if(description.length > 120){
                return res.status(400).json({
                    error: "Description cannot be longer than 40 characters!"
                });
            }
        }
    }
    if(id_delivery_method){
        if(id_delivery_method < 1 || id_delivery_method > 3){
            return res.status(400).json({
                error: "Invalid input id_delivery_method!"
            });
        }
    }
    
    next();
};


module.exports = {
    addNewProduct,
    searchProduct, 
    updateProduct
};
