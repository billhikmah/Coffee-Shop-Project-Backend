const successResponse = (res, status, data, total) => {
    res.status(status).json({
        data,
        total,
        err: null
    });
};

const errorResponse = (res, status, err) => {
    res.status(status).json({
        err
    });
};

module.exports = {
    successResponse,
    errorResponse
}
