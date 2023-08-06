const ErrorHandler = require('./errorHandler');

const sendToken = (user, req, res, next) => {
    try {
        const token = user.getJwtToken();

        // कुकीज़ को सेट करने की जगह, local storage में सेट करें
        localStorage.setItem("token", token);

        res.json({
            success: true,
            message: "🎉🎉🎉Successfully🎉🎉🎉",
            token,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

module.exports = sendToken;
