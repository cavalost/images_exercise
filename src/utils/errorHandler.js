const createError = require('http-errors');

const handle404Error = (req, res, next) => next(new createError.NotFound());

const handleErrors = ({ status = 500, message }, req, res, next) => {
    res.status(status).json({ error: message });
};

module.exports = {
    handle404Error,
    handleErrors,
};
