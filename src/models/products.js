const db = require("../config/db");

const searchProductFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const {name, id_category, sort, order = "asc", page = 1, limit = 5} = query;
        const offset = (page - 1)*limit;
        
        let totalQuery = "select count(*) from public.products p";
        let productsQuery = "SELECT p.id, p.name, s.name as \"size\", p.price, c.name as \"category\", d.name as \"delivery method\", p.start_hour as \"start hour\", p.end_hour \"end hour\", p.stock, p.picture, p.input_time FROM public.products p join public.size s on p.id_size = s.id join public.category c on p.id_category = c.id join public.delivery d on p.id_delivery_method = d.id";
        let transactionsQuery = "SELECT t.id_product, p.name, count(t.id_product) as \"order total\", c.name as \"category\" FROM public.transactions t join products p on t.id_product = p.id join category c on p.id_category = c.id";

        if(sort === "favorites"){
            totalQuery = "SELECT count(t.id_user), t.id_product  FROM public.transactions t join public.products p on p.id = t.id_product";

            if(id_category){
                totalQuery += " where p.id_category = $1 group by id_product";

                return db.query(totalQuery, [id_category])
                .then((result) => {
                    const totalData = result.rowCount;
                    transactionsQuery += " where p.id_category = $1 group by t.id_product, p.\"name\", c.name order by \"order total\" " + order + " limit $2 offset $3";
                    
                    return db.query(transactionsQuery, [
id_category, limit, offset
])
                    .then((result) => {
                        if(result.rowCount === 0){
                            return reject({
                                error: "Menu Not Found",
                                status: 404
                            });
                        }
    
                        const response = {
                            totalData,
                            totalPage: Math.ceil(totalData/limit),
                            totalDataOnThisPage: result.rowCount,
                            data: result.rows
                        };
    
                        return resolve(response);
                    })
                    .catch((error) => {
                        return reject({
                            error,
                            status: 500
                        });
                    });
                })
                .catch((error) => {
                    return reject({
                        error,
                        status: 500
                    });
                });
            }

            totalQuery += " group by id_product ";

            return db.query(totalQuery)
            .then((result) => {
                const totalData = result.rowCount;
                transactionsQuery += " group by t.id_product, p.\"name\", c.name order by \"order total\" " + order + " limit $1 offset $2";

                return db.query(transactionsQuery, [
limit, offset
])
                .then((result) => {
                    if(result.rowCount === 0){
                        return reject({
                            error: "Menu Not Found",
                            status: 404
                        });
                    }

                    const totalPage = totalData/limit;
                    const response = {
                        totalData,
                        totalPage: Math.ceil(totalPage),
                        totalDataOnThisPage: result.rowCount,
                        data: result.rows
                    };

                    return resolve(response);
                })
                .catch((error) => {
                    return reject({
                        error,
                        status: 500
                    });
                });
            })
            .catch((error) => {
                return reject({
                    error,
                    status: 500
                });
            });

        }

        if(name){
            productsQuery += " where lower(p.name) like lower('%' || $1 || '%')";
            totalQuery += " where lower(p.name) like lower('%' || $1 || '%')";

            if(id_category){
                productsQuery += " AND p.id_category = " + id_category;
                totalQuery += " AND p.id_category = " + id_category;
            }
            if(sort){
                productsQuery += " order by " + sort + " " + order;
            }

            return db.query(totalQuery, [name])
            .then((result) => {
                const totalData = parseInt(result.rows[0].count);
                productsQuery += " limit $2 offset $3";

                return db.query(productsQuery, [
name, limit, offset
])
                .then((result) => {
                    if(result.rowCount === 0){
                        return reject({
                            error: "Menu Not Found",
                            status: 404
                        });
                    }

                    const totalPage = totalData/limit;
                    const response = {
                        totalData,
                        totalPage: Math.ceil(totalPage),
                        totalDataOnThisPage: result.rowCount,
                        data: result.rows
                    };

                    return resolve(response);
                })
                .catch((error) => {
                    return reject({
                        error,
                        status: 500
                    });
                });
            })
            .catch((error) => {
                return reject({
                    error,
                    status: 500
                });
            });
        }

        if(id_category){
            totalQuery += " where p.id_category = " + id_category;
            productsQuery += " where p.id_category = " + id_category;
        }
        if(sort){
            productsQuery += " order by " + sort + " " + order + " limit $1 offset $2";
        }
        
        return db.query(totalQuery)
        .then((result) => {
            const totalData = parseInt(result.rows[0].count);

            return db.query(productsQuery, [
limit, offset
])
                .then((result) => {
                    if(result.rows.length === 0){
                        return reject({
                            error: "Menu Not Found",
                            status: 404
                        });
                    }
                    
                    const totalPage = totalData/limit;
                    const response = {
                        totalData,
                        totalPage: Math.ceil(totalPage),
                        totalDataOnThisPage: result.rowCount,
                        data: result.rows
                    };

                    return resolve(response);
                })
                .catch((error) => {
                    return reject({
                        error,
                        status: 500
                    });
                });
            })
        .catch((error) => {
            return reject({
                error,
                status: 500
            });
        });
    });
};

const addNewProduct = (body, picture) => {
    return new Promise((resolve, reject) => {
        const {name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock} = body;
        const input_time = new Date(Date.now());
        const sqlQuery = 'INSERT INTO public.products (name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture, input_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING *';
        db.query(sqlQuery, [
name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock, picture, input_time
])
        .then(({rows}) => {
            const response ={
                data: rows[0]
            };
            resolve(response);
        })
        .catch((error) => {
            reject({
                status: 500,
                error
            });
        });
    });
};

const updateProduct = (body, query, picture) => {
    return new Promise((resolve, reject) => {
        const {name, id_size, price, id_category, description, id_delivery_method, start_hour, end_hour, stock} = body;
        const {id} = query;
        const input_time = new Date(Date.now());
        let sqlQuery = "UPDATE public.products set name = COALESCE ($1, name), id_size  = COALESCE ($2, id_size), price  = COALESCE ($3, price), id_category  = COALESCE ($4, id_category), description  = COALESCE ($5, description), id_delivery_method  = COALESCE ($6, id_delivery_method), stock  = COALESCE ($7, stock), picture  = COALESCE ($8, picture), start_hour = COALESCE ($9, start_hour), end_hour = coalesce ($10,end_hour), input_time = coalesce ($11, input_time) WHERE id = $12 returning *";
            db.query(sqlQuery, [
name, id_size, price, id_category, description, id_delivery_method, stock, picture, start_hour, end_hour, input_time, id
])
            .then(({rows}) => {
                if(rows.length === 0){
                    return reject({
                        error: "Id Not Found!",
                        status: 400
                    });
                }
                const response = {
                    message: "Product Updated!",
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

const deleteProductFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const {id} = query;
        let sqlQuery = "DELETE FROM public.products WHERE id= $1 returning *";
        db.query(sqlQuery, [id])
        .then(({rows, rowCount}) => {
            if(rows.length === 0){
                return reject({
                    error: "Product Id Not Found!",
                    status: 400
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
                status: 500
            });
        });
    });
};

module.exports = {
    addNewProduct,
    searchProductFromServer,
    updateProduct,
    deleteProductFromServer
};
