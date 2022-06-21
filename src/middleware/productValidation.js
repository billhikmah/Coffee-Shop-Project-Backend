const searchProduct = (req, res, next) => {
    const {name, category_id, sort, order} = req.query;
    if(name){
        if(typeof name !== "string"){
            return res.status(400).json({
                error: "Invalid input name!"
            });
        }
    }
    if(category_id){
        if( category_id !== "1" && category_id !== "2" && category_id !== "3"){
            return res.status(400).json({
                error: "Invalid input category_id!"
            });
        }
    }
    if(sort){
        if(sort !== "price" && sort !== "input_time" && sort !== "favorites" && sort !== "id" && sort !== "name"){
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
    const {name, size_id, price, category_id, description, delivery_method_id, start_hour, end_hour, stock, picture} = req.body;
    const validateQuery = Object.keys(req.body).filter(
        (key) => {
return key === "name" || key === "price" || key === "category_id" ||
            key === "delivery_method_id" || key === "size_id" || key === "stock";
}
    );

    if(validateQuery.length < 6){
        return res.status(400).json({
            error: "New product input must contain name, size_id, price, category_id, delivery_method_id, and stock",
            added_input: validateQuery
        });
    }
    if(name.length >= 40){
        return res.status(400).json({
            error: "Name cannot be longer than 40 characters!"
        });
    }
    if(size_id < 1 || size_id > 7){
        return res.status(400).json({
            error: "Invalid input size_id!"
        });
    }
    if(price.length > 6){
        return res.status(400).json({
            error: "Price cannot be longer than 6 characters!"
        });
    }
    if(category_id < 1 || category_id > 3){
        return res.status(400).json({
            error: "Invalid input category_id!"
        });
    }
    if(description){
        if(description.length >= 150){
            return res.status(400).json({
                error: "Description cannot be longer than 150 characters!"
            });
        }
    }
    if(delivery_method_id < 1 || delivery_method_id > 3){
        return res.status(400).json({
            error: "Invalid input delivery_method_id!"
        });
    }
    next();
};

const updateProduct = (req, res, next) => {
    const {name, size_id, price, category_id, description, delivery_method_id, start_hour, end_hour, stock, picture} = req.body;
    const {file} = req;

    if(name){
        if(name.length > 40){
            return res.status(400).json({
                error: "Name cannot be longer than 40 characters!"
            });
        }
    }
    if(size_id){
        if(size_id < 1 || size_id > 7){
            return res.status(400).json({
                error: "Invalid input size_id!"
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
    if(category_id){
        if(category_id < 1 || category_id > 3){
            return res.status(400).json({
                error: "Invalid input category_id!"
            });
        }
    }
    if(description){
        if(description){
            if(description.length > 200){
                return res.status(400).json({
                    error: "Description cannot be longer than 200 characters!"
                });
            }
        }
    }
    if(delivery_method_id){
        if(delivery_method_id < 1 || delivery_method_id > 3){
            return res.status(400).json({
                error: "Invalid input delivery_method_id!"
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
