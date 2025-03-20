const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const extraDetails = err.extraDetails || "An error occurred.";

    res.status(status).json({
        status,
        message,
        extraDetails
    });
};

module.exports = errorMiddleware;
