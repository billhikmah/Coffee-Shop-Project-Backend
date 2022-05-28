const db = require("../config/db");

const searchProductFromServer = (data) => {
    return new Promise((resolve, reject) => {
        const {name, category_id, sort = "id", order = "asc", page = 1, limit = 5} = data;
        const offset = (page - 1)*limit;
        
        let totalQuery = "select count(*) from public.products p";
        let query = "SELECT p.id, p.name, s.name as \"size\", p.price, c.name as \"category\", d.name as \"delivery method\", p.start_hour as \"start hour\", p.end_hour \"end hour\", p.stock, p.picture, p.input_time FROM public.products p join public.size s on p.size_id = s.id join public.category c on p.category_id = c.id join public.delivery d on p.delivery_method_id = d.id";
        let totalQueryValues;
        let queryValues;

        if(sort === "favorites"){
        query = "SELECT t.product_id, p.name, count(t.product_id) as \"order total\", c.name as \"category\" FROM public.transactions t join products p on t.product_id = p.id join category c on p.category_id = c.id";
        totalQuery = "SELECT count(*), t.product_id  FROM public.transactions t join public.products p on p.id = t.product_id";

            if(category_id){
                totalQuery += " where p.category_id = $1 group by product_id";
                totalQueryValues = [category_id];

                query += " where p.category_id = $1 group by t.product_id, p.\"name\", c.name order by \"order total\" " + order + " limit $2 offset $3";
                queryValues = [category_id, limit, offset];
            }
            if(!category_id){
                totalQuery += " group by product_id ";
                totalQueryValues = [];
                
                query += " group by t.product_id, p.\"name\", c.name order by \"order total\" " + order + " limit $1 offset $2";
                queryValues = [limit, offset];
            }
        }
        if(sort !== "favorites" && name){
            if(category_id){
                totalQuery += " where lower(p.name) like lower('%' || $1 || '%') AND p.category_id = $2";
                totalQueryValues = [name, category_id];
                
                query += " where lower(p.name) like lower('%' || $1 || '%') AND p.category_id = $2 order by " + sort + " " + order + " limit $3 offset $4";
                queryValues = [name, category_id, limit, offset];                
            }
            if(!category_id){
                totalQuery += " where lower(p.name) like lower('%' || $1 || '%')";
                totalQueryValues = [name];

                query += " where lower(p.name) like lower('%' || $1 || '%')  limit $2 offset $3";
                queryValues = [name, limit, offset];
            }
        }
        if(sort !== "favorites" && !name){
            if(category_id){
                totalQuery += " where p.category_id = $1";
                totalQueryValues = [category_id];

                query += " where p.category_id = $1 order by " + sort + " " + order + " limit $2 offset $3";
                queryValues = [category_id, limit, offset];
            }
            if(!category_id){
                totalQueryValues = [];

                query += " order by " + sort + " " + order + " limit $1 offset $2";
                queryValues = [limit, offset];
            }
        }

        return db.query(totalQuery, totalQueryValues)
        .then((result) => {
            let totalData;
            if(sort === "favorites"){
                totalData = parseInt(result.rowCount);
            }
            if(sort !== "favorites"){
                totalData = parseInt(result.rows[0].count);
            }
            

            return db.query(query, queryValues)
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
        const {name, size_id, price, category_id, description, delivery_method_id, start_hour, end_hour, stock} = body;
        const input_time = new Date(Date.now());
        const sqlQuery = 'INSERT INTO public.products (name, size_id, price, category_id, description, delivery_method_id, start_hour, end_hour, stock, picture, input_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING *';
        db.query(sqlQuery, [name, size_id, price, category_id, description, delivery_method_id, start_hour, end_hour, stock, picture, input_time])
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
        const {name, size_id, price, category_id, description, delivery_method_id, start_hour, end_hour, stock} = body;
        const {id} = query;
        const input_time = new Date(Date.now());
        let sqlQuery = "UPDATE public.products set name = COALESCE ($1, name), size_id  = COALESCE ($2, size_id), price  = COALESCE ($3, price), category_id  = COALESCE ($4, category_id), description  = COALESCE ($5, description), delivery_method_id  = COALESCE ($6, delivery_method_id), stock  = COALESCE ($7, stock), picture  = COALESCE ($8, picture), start_hour = COALESCE ($9, start_hour), end_hour = coalesce ($10,end_hour), input_time = coalesce ($11, input_time) WHERE id = $12 returning *";
            db.query(sqlQuery, [name, size_id, price, category_id, description, delivery_method_id, stock, picture, start_hour, end_hour, input_time, id])
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
