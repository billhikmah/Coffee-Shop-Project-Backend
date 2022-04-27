const db = require("../config/db");

const addNewProduct = (body) => {
    return new Promise((resolve, reject) => {
        const {name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture, } = body;
        const sqlQuery = 'INSERT INTO public.products (name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *';
        db.query(sqlQuery, [name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture])
        .then(({rows})=>{
            const response ={
                data: rows[0],
            };
            resolve(response);
        })
        .catch((error)=>{
            reject({
                status: 500,
                error,
            });
        });
    });
    
};

const searchProductFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const {name, id_category, sort, order} = query;
        let sqlQuery = "SELECT p.id, p.name, s.name as \"size\", p.price, c.name as \"category\", d.name as \"delivery method\", p.start_hour as \"start hour\", p.end_hour \"end hour\", p.stock, p.picture, p.input_time FROM public.products p join public.size s on p.id_size = s.id join public.category c on p.id_category = c.id join public.delivery d on p.id_delivery_method = d.id where lower(p.name) like lower('%' || $1 || '%')";
        if(sort === "favorites"){
            if(id_category){
                sqlQuery = "SELECT t.id_product, p.name, count(t.id_product) as \"order total\", c.name as \"category\" FROM public.transactions t join products p on t.id_product = p.id join category c on p.id_category = c.id where p.id_category = $1 group by t.id_product, p.\"name\", c.name order by \"order total\" " + order;
                db.query(sqlQuery, [id_category])
                .then((result) => {
                    if(result.rows.length === 0){
                        return reject({
                            error: "Menu Not Found",
                            status: 404,
                        });
                    }
                    const response = {
                        total: result.rowCount,
                        data: result.rows
                    };
                    resolve(response);
                })
                .catch((error) => {
                    reject({
                        error,
                        status: 500
                    });
                });
            }
            sqlQuery = "SELECT t.id_product, p.name, count(t.id_product) as \"order total\", c.name as \"category\" FROM public.transactions t join products p on t.id_product = p.id join category c on p.id_category = c.id group by t.id_product, p.\"name\", c.name order by \"order total\" " + order;
            db.query(sqlQuery)
            .then((result) => {
                if(result.rows.length === 0){
                    return reject({
                        error: "Menu Not Found",
                        status: 404,
                    });
                }
                const response = {
                    total: result.rowCount,
                    data: result.rows
                };
                resolve(response);
            })
            .catch((error) => {
                reject({
                    error,
                    status: 500
                });
            });
            
        }
        if(id_category){
            sqlQuery += " AND p.id_category = " + id_category;
        }
        if(order){
            sqlQuery += "order by " + sort + " " + order;
        }

        db.query(sqlQuery, [name])
        .then((result) => {
            if(result.rows.length === 0){
                return reject({
                    error: "Menu Not Found",
                    status: 404,
                });
            }
            const response = {
                total: result.rowCount,
                data: result.rows
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                error,
                status: 500
            });
        });
    });
};

const updateStock = (body) => {
    return new Promise((resolve, reject) => {
        const {id, stock} = body;
        let sqlQuery = "UPDATE public.products SET stock = $1 WHERE id = $2 returning name, stock";
        db.query(sqlQuery, [stock, id])
        .then(({rows}) => {
            if(rows.length === 0){
                return reject({
                    error: "Id is not found!",
                    status: 400,
                });
            }
            const response = {
                message: "Stock Updated!",
                data: rows
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                error,
                status: 500
            });
        });
    });
};

const deleteProductFromServer = (body) => {
    return new Promise((resolve, reject) => {
        const {stock} = body;
        let sqlQuery = "DELETE FROM public.products WHERE stock= $1 returning id, name, stock;";
        db.query(sqlQuery, [stock])
        .then(({rows, rowCount}) => {
            if(rows.length === 0){
                return reject({
                    error: "No product is out of stock!",
                    status: 400,
                });
            }
            const response = {
                message: "Product Deleted",
                total: rowCount,
                data: rows
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                error,
                status: 500,
            });
        });
    });
};

module.exports = {
    addNewProduct,
    searchProductFromServer,
    updateStock,
    deleteProductFromServer
};