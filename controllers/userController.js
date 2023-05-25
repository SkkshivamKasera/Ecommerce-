const Users = require('../models/userModel')
const sendToken = require('../utills/jwtToken')
const sendEmail = require('../utills/sendEmail')
const crypto = require('crypto')
const success = true

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        let user = await Users.findOne({ email })
        if (user) { return res.send({ success: (!success), errors: "Email is already exists" }) }
        user = await Users.create({
            name, email, password, role,
            avatar: {
                public_id: "sampleId",
                url: "Text"
            }
        })
        sendToken(user, req, res)
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) { return res.send({ success: (!success), errors: "Please enter email or password" }) }
        const user = await Users.findOne({ email }).select("+password")
        if (!user) { return res.send({ success: (!success), errors: "Not Found" }) }
        const checkPassword = await user.comaparePassword(password)
        if (!checkPassword) { return res.send({ success: (!success), errors: "Not Found" }) }
        const token = user.getJwtToken()
        sendToken(user, req, res)
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.logoutUser = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.send({ success: success, message: "Logout Successfully" })
}

exports.forgotPassword = async (req, res, next) => {
    const user = await Users.findOne({ email: req.body.email })
    if (!user) { return res.send({ success: (!success), errors: "Not Found" }) }

    const resetToken = await user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetPasswordLink = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset link is :- \n\n${resetPasswordLink}\n\nIf you have not requested this email then, please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message
        })
        res.send({ success: success, message: `Email sent to ${user.email} successfully` })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await Users.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) { return res.send({ success: (!success), errors: "Token Expire" }) }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send({ success: (!success), errors: "Password not changable" })
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, req, res)
}

exports.getUserDetails = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)
        res.send({ success: success, Details: user })

    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("+password")
        const checkPassword = await user.comaparePassword(req.body.oldPassword)
        if (!checkPassword) { return res.send({ success: (!success), errors: "Old password is incorrect" }) }
        if (req.body.newPassword !== req.body.confirmPassword) {
            res.send({ success: (!success), errors: "Password does not match" })
        }
        user.password = req.body.newPassword
        await user.save()
        sendToken(user, req, res)
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.updateProfile = async (req, res) => {
    const newUserDate = {
        "name": req.body.name,
        "email": req.body.email
    }

    const user = await Users.findByIdAndUpdate(req.user.id, newUserDate, { new: true, runValidators: true })

    res.send({ success: success, message: "🎉🎉🎉Successfully🎉🎉🎉" })
}

// Get all users. ==> Only Admin
exports.getAllUser = async (req, res) => {
    try {
        const users = await Users.find()
        res.send({ success: success, users: users })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.getSingleUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if (!user) { return res.send({ success: (!success), errors: "Not Found" }) }
        res.send({ success: success, user: user })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.updateRole = async (req, res) => {
    try {
        const newUserDate = {
            "email": req.body.email,
            "role": req.body.role
        }

        const user = await Users.findByIdAndUpdate(req.params.id, newUserDate, { new: true, runValidators: true })

        res.send({ success: success, message: "🎉🎉🎉Successfully🎉🎉🎉" })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if (!user) { return res.send({success: (!success), errors: "User Not Found" })}
        await user.deleteOne()
        res.send({ success: success, message: "🎉🎉🎉Successfully🎉🎉🎉" })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}