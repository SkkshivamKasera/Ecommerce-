const ErrorHandler = require('./errorHandler')
const sendToken = (user, req, res, next) => {
    try{const token = user.getJwtToken()
    console.log( process.env.COOKIE_EXPIRE )
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: false
    }

    res.cookie("token", token, options).json({
        success: true,
        message: "🎉🎉🎉Successfully🎉🎉🎉",
        token,
        user
    })}catch(error){
        return next(new ErrorHandler(error.message))
    }
}

module.exports = sendToken