const sendToken = (user, req, res, next) => {
    try {
        const token = user.getJwtToken();
        console.log(process.env.COOKIE_EXPIRE);
        
        // Determine the secure value based on the environment
        const secureFlag = req.secure || req.headers['x-forwarded-proto'] === 'https';
        
        res.cookie("token", token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true, // Set the secure flag based on the environment
            domain: "https://ecommerce-hc5g.onrender.com"
        }).json({
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
