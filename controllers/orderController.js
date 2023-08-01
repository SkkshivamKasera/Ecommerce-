const Orders = require('../models/orderModel')
const Products = require('../models/productModel')
const ErrorHandler = require('../utills/errorHandler')
const success = true
exports.newOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body

        const order = await Orders.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        })
        res.send({ success: success, message: "🎉🎉🎉Successfully🎉🎉🎉", order: order })
    } catch (error) {
        return next(new ErrorHandler(error.message))
    }
}

exports.getSingleOrderDetails = async (req, res,next) => {
    try {
        const order = await Orders.findById(req.params.id).populate("user", "name email")
        if (!order) { return next(new ErrorHandler("Order Not Found")) }
        res.send({ success: success, message: "🎉🎉🎉Successfully🎉🎉🎉", order: order })
    }
    catch (error) {
        return next(new ErrorHandler(error.message))
    }
}

exports.myOrders = async (req, res, next) => {
    try {
        const order = await Orders.find({ user: req.user._id })
        res.send({ success: success, message: "🎉🎉🎉Successfully🎉🎉🎉", order: order })
    }
    catch (error) {
        return next(new ErrorHandler(error.message))
    }
}
// Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find()
        let totalAmount = 0
        orders.forEach((order) => {
            totalAmount += order.totalPrice
        })
        res.send({
            success: success, message: "🎉🎉🎉Successfully🎉🎉🎉", order: orders,
            totalAmount: totalAmount
        })
    }
    catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id)
        if (!order) {return res.send({ success: (!success), errors: "Order Not Found" })}
        if (order.orderStatus === "Delivered") {
            res.send({ message: "You have already delivered this order" })
        }
        order.orderItems.forEach(async (order) => {
            await updateStock(order.product, order.quantity)
        })
        order.orderStatus = req.body.status
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now()
        }

        await order.save({ validateBeforeSave: false })
        res.send({
            success: success, message: "🎉🎉🎉Successfully🎉🎉🎉"
        })
    }
    catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

async function updateStock(id, quantity) {
    const product = await Products.findById(id)
    product.stock = quantity
    await product.save({ validateBeforeSave: false })
}

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id)
        if (!order) {return res.send({ success: (!success), errors: "Order Not Found" })}
        await order.deleteOne()
        res.send({success: success, message: "🎉🎉🎉Successfully🎉🎉🎉"})
    }
    catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}