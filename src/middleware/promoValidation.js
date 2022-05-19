const addNewPromo = (req, res, next) => {
    const {name, price, product_id, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code, picture} = req.body;
    const validateQuery = Object.keys(req.body).filter(
        (key) => {
return key === "name" || key === "price" || key === "disc" ||
            key === "delivery_method_id" || key === "start_date" || key === "end_date" || key === "coupon_code" || key === "product_id";
}
    );

    if(validateQuery.length < 8){
        return res.status(400).json({
            error: "New product input must contain name, price, disc, delivery_method_id, start_date, end_date, coupon_code, and product_id!",
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
    if(disc < 0.05 || disc > 1){
        return res.status(400).json({
            error: "Invalid input discount!"
        });
    }
    if(description){
        if(description.length >= 120){
            return res.status(400).json({
                error: "Description cannot be longer than 40 characters!"
            });
        }
    }
    if(delivery_method_id < 1 || delivery_method_id > 3){
        return res.status(400).json({
            error: "Invalid input delivery_method_id!"
        });
    }
    if(coupon_code.length >= 10){
        return res.status(400).json({
            error: "Coupon Code cannot be longer than 10 characters!"
        });
    }
    next();
};

const updatePromo = (req, res, next) => {
    const {name, price, description, size_id, delivery_method_id, disc, start_date, end_date, coupon_code, picture, product_id} = req.body;

    if(name){
        if(name.length >= 40){
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
    if(disc){
        if(disc < 0.05 || disc > 1){
            return res.status(400).json({
                error: "Invalid input discount!"
            });
        }
    }
    if(description){
        if(description){
            if(description.length >= 120){
                return res.status(400).json({
                    error: "Description cannot be longer than 40 characters!"
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
    if(coupon_code){
        if(coupon_code.length >= 10){
            return res.status(400).json({
                error: "Coupon Code cannot be longer than 10 characters!"
            });
        }
    }

    next();
};

module.exports ={
    addNewPromo,
    updatePromo
};
