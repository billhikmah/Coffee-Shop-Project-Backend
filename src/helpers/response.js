const successResponse = (res, status, data) => {
    res.status(status).json({
        data,
        err: null
    });
};

const errorResponse = (res, status, err) => {
    res.status(status).json({
        err
    });
};

const searchResponse = (res, status, data, meta) => {
    res.status(status).json({
        data,
        meta
    });
};

module.exports = {
    successResponse,
    errorResponse, 
    searchResponse
};
