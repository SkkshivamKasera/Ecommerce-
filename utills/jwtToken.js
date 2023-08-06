const ErrorHandler = require('./errorHandler')
const sendToken = (user, req, res, next) => {
    try{const token = user.getJwtToken()
    console.log( process.env.COOKIE_EXPIRE )
    res.cookie("token", token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: false
    }).json({
        success: true,
        message: "🎉🎉🎉Successfully🎉🎉🎉",
        token,
        user
    })}catch(error){
        return next(new ErrorHandler(error.message))
    }
}

module.exports = sendToken