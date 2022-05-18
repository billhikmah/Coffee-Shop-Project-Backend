const addNewPromo = (req, res, next) => {
    const {name, price, id_name, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture} = req.body;
    const validateQuery = Object.keys(req.body).filter(
        (key) => {
return key === "name" || key === "price" || key === "disc" ||
            key === "id_delivery_method" || key === "start_date" || key === "end_date" || key === "coupon_code" || key === "id_name";
}
    );

    if(validateQuery.length < 8){
        return res.status(400).json({
            error: "New product input must contain name, price, disc, id_delivery_method, start_date, end_date, coupon_code, and id_name!",
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
    if(id_delivery_method < 1 || id_delivery_method > 3){
        return res.status(400).json({
            error: "Invalid input id_delivery_method!"
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
    const {name, price, description, id_size, id_delivery_method, disc, start_date, end_date, coupon_code, picture, id_name} = req.body;

    if(name){
        if(name.length >= 40){
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
    if(id_delivery_method){
        if(id_delivery_method < 1 || id_delivery_method > 3){
            return res.status(400).json({
                error: "Invalid input id_delivery_method!"
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
