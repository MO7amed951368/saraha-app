const errorHandler = (err, req, res, next) => {
    // console.error(err.stack);
    res.status(err.statusCode || 500)
        .json({
            error: err.message || 'Internal Server Error',
            errorBody: err.data,
            code: err.code
        });
};

export default errorHandler;