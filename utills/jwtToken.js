const sendToken = (user, req, res, next) => {
    try {
        const token = user.getJwtToken();
        console.log(process.env.COOKIE_EXPIRE);
        
        // Determine the secure value based on the environment
        const secureFlag = req.secure || req.headers['x-forwarded-proto'] === 'https';
        
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
            domain: ""
        })
        console.log(token)

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
