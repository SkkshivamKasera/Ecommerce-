const jwt = require('jsonwebtoken')
const Users = require('../models/userModel')
exports.isAuthenticatedUser = async (req, res, next) => {
    try{
        const {token} = req.cookies
        if(!token){
            return next(res.send({success: false, errors: "Please login to access this resource"}))
        }
        const decodeData = jwt.verify(token, process.env.SIGN)
        req.user = await Users.findById(decodeData.id)
        next()

    }catch(error){
        console.log(error.message)
        return res.send({success: false, errors: error.message})
    }
}

exports.authorizeRoles = (...roles) => {
    return (req, res, next)=>{
        console.log("yes")
        if(!roles.includes(req.user.role)){
            return next(res.send({success: false, errors: `Role: ${req.user.role} is not allowed to access this resource`}))
        }
        next()
    }
}