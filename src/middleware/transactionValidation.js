const addNewTransaction = (req, res, next) => {
    const {product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, address} = req.body;
    const {user_id} = req.query;
    let validateQuery = Object.keys(req.body).filter(
        (key) => {
            return key === "user_id" || key === "product_id" || key === "qty" ||
            key === "total_price" || key === "delivery_method_id" || key === "time" ||
            key === "date" || key === "payment_method_id" || key === "address";
        }
    );
    validateQuery.push(user_id);

    if(validateQuery.length < 9){
        return res.status(400).json({
            error: "New transaction input must contain user_id, product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, and address!",
            added_input: validateQuery
        });
    }
    if(typeof parseInt(user_id) !== "number"){
        return res.status(400).json({
            error: "Invalid input user_id!"
        });
    }
    if(typeof product_id !== "number"){
        return res.status(400).json({
            error: "Invalid input product_id!"
        });
    }
    if(typeof qty !== "number"){
        return res.status(400).json({
            error: "Invalid input qty!"
        });
    }
    if(typeof total_price !== "number"){
        return res.status(400).json({
            error: "Invalid input total_price!"
        });
    }
    if(typeof delivery_method_id !== "number"){
        return res.status(400).json({
            error: "Invalid input delivery_method_id!"
        });
    }
    if(delivery_method_id !== 1 && delivery_method_id !== 2 && delivery_method_id !== 3){
        return res.status(400).json({
            error: "Invalid input delivery_method_id!"
        });
    }
    if(typeof payment_method_id !== "number"){
        return res.status(400).json({
            error: "Invalid input payment_method_id!"
        });
    }
    if(payment_method_id !== 1 && payment_method_id !== 2 && payment_method_id !== 3){
        return res.status(400).json({
            error: "Invalid input payment_method_id!"
        });
    }
    if(typeof address !== "number"){
        return res.status(400).json({
            error: "Invalid input address!"
        });
    }
    next();
};

const updateTransaction = (req, res, next) => {
    const {product_id, qty, total_price, delivery_method_id, time, date, payment_method_id, address} = req.body;
    const {user_id} = req.query;

    if(user_id){
        if(typeof user_id !== "number"){
            return res.status(400).json({
                error: "Invalid input user_id!"
            });
        }
    }
    if(product_id){
        if(typeof product_id !== "number"){
            return res.status(400).json({
                error: "Invalid input product_id!"
            });
        }
    }
    if(qty){
        if(typeof qty !== "number"){
            return res.status(400).json({
                error: "Invalid input qty!"
            });
        }
    }
    if(total_price){
        if(typeof total_price !== "number"){
            return res.status(400).json({
                error: "Invalid input total_price!"
            });
        }
    }
    if(delivery_method_id){
        if(typeof delivery_method_id !== "number"){
            return res.status(400).json({
                error: "Invalid input delivery_method_id!"
            });
        }
        if(delivery_method_id !== 1 && delivery_method_id !== 2 && delivery_method_id !== 3){
            return res.status(400).json({
                error: "Invalid input delivery_method_id!"
            });
        }
    }
    if(payment_method_id){
        if(typeof payment_method_id !== "number"){
            return res.status(400).json({
                error: "Invalid input payment_method_id!"
            });
        }
        if(payment_method_id !== 1 && payment_method_id !== 2 && payment_method_id !== 3){
            return res.status(400).json({
                error: "Invalid input payment_method_id!"
            });
        }
    }
    if(address){
        if(typeof address !== "number"){
            return res.status(400).json({
                error: "Invalid input address!"
            });
        }
    }
    next();
};

module.exports = {
    addNewTransaction, 
    updateTransaction
};
