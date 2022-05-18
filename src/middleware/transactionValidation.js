const addNewTransaction = (req, res, next) => {
    const {id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address} = req.body;
    const {id_user} = req.query;
    let validateQuery = Object.keys(req.body).filter(
        (key) => {
return key === "id_user" || key === "id_product" || key === "qty" ||
            key === "id_total" || key === "id_delivery" || key === "time" ||
            key === "date" || key === "id_payment_methods" || key === "address";
}
    );
    validateQuery.push(id_user);

    if(validateQuery.length < 9){
        return res.status(400).json({
            error: "New transaction input must contain id_user, id_product, qty, id_total, id_delivery, time, date, id_payment_methods, and address!",
            added_input: validateQuery
        });
    }
    if(typeof parseInt(id_user) !== "number"){
        return res.status(400).json({
            error: "Invalid input id_user!"
        });
    }
    if(typeof id_product !== "number"){
        return res.status(400).json({
            error: "Invalid input id_product!"
        });
    }
    if(typeof qty !== "number"){
        return res.status(400).json({
            error: "Invalid input qty!"
        });
    }
    if(typeof id_total !== "number"){
        return res.status(400).json({
            error: "Invalid input id_total!"
        });
    }
    if(typeof id_delivery !== "number"){
        return res.status(400).json({
            error: "Invalid input id_delivery!"
        });
    }
    if(id_delivery !== 1 && id_delivery !== 2 && id_delivery !== 3){
        return res.status(400).json({
            error: "Invalid input id_delivery!"
        });
    }
    if(typeof id_payment_methods !== "number"){
        return res.status(400).json({
            error: "Invalid input id_payment_methods!"
        });
    }
    if(id_payment_methods !== 1 && id_payment_methods !== 2 && id_payment_methods !== 3){
        return res.status(400).json({
            error: "Invalid input id_payment_methods!"
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
    const {id_product, qty, id_total, id_delivery, time, date, id_payment_methods, address} = req.body;
    const {id_user} = req.query;

    if(id_user){
        if(typeof id_user !== "number"){
            return res.status(400).json({
                error: "Invalid input id_user!"
            });
        }
    }
    if(id_product){
        if(typeof id_product !== "number"){
            return res.status(400).json({
                error: "Invalid input id_product!"
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
    if(id_total){
        if(typeof id_total !== "number"){
            return res.status(400).json({
                error: "Invalid input id_total!"
            });
        }
    }
    if(id_delivery){
        if(typeof id_delivery !== "number"){
            return res.status(400).json({
                error: "Invalid input id_delivery!"
            });
        }
        if(id_delivery !== 1 && id_delivery !== 2 && id_delivery !== 3){
            return res.status(400).json({
                error: "Invalid input id_delivery!"
            });
        }
    }
    if(id_payment_methods){
        if(typeof id_payment_methods !== "number"){
            return res.status(400).json({
                error: "Invalid input id_payment_methods!"
            });
        }
        if(id_payment_methods !== 1 && id_payment_methods !== 2 && id_payment_methods !== 3){
            return res.status(400).json({
                error: "Invalid input id_payment_methods!"
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
