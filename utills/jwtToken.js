const sendToken = (user, req, res) => {
    const token = user.getJwtToken()
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.cookie("token", token, options).json({
        success: true,
        message: "🎉🎉🎉Successfully🎉🎉🎉",
        token,
        user
    })
}

module.exports = sendToken