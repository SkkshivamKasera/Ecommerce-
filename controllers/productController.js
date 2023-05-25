const Products = require('../models/productModel')
const ApiFeatures = require('../utills/apifeatures')

const success = true

exports.createProducts = async (req, res, next) => {
    try {
        req.body.user = req.user.id
        const product = await Products.create(req.body)
        res.status(201).json({ success: success, product })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        let resultPerPage = 20
        const productsCount = await Products.countDocuments()
        const apifeatures = new ApiFeatures(Products.find(), req.query).search().filter().pagination(resultPerPage)
        const products = await apifeatures.query
        res.status(200).send({ success: (success), products: products, productsCount: productsCount })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.getProductDetails = async (req, res, next) => {
    try {
        let product = await Products.findById(req.params.id)
        if (!product) {
            return res.send({ success: (!success), errors: "Product Not Found" })
        }
        res.send({ success: success, product:product})
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.updateProducts = async (req, res, next) => {
    try {
        let product = await Products.findById(req.params.id)
        if (!product) {
            return res.send({ success: (!success), errors: "Product Not Found" })
        }
        product = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send({ success: success, message: "🎉🎉🎉Product updation successfully🎉🎉🎉" })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.deleteProducts = async (req, res, next) => {
    try {
        let product = await Products.findById(req.params.id)
        if (!product) {
            return res.send({ success: (!success), errors: "Product Not Found" })
        }
        product = await Products.findByIdAndDelete(req.params.id)
        res.send({ success: success, message: "🎉🎉🎉Product delete successfully🎉🎉🎉" })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }
        const product = await Products.findById(productId)
        const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
        if (isReviewed) {
            product.reviews.forEach(rev => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.rating = rating
                    rev.comment = comment
                }
            })
        } else {
            product.reviews.push(review)
            product.numberOfReviews = product.reviews.length
        }
        let avg = 0
        product.reviews.forEach(rev => {
            avg += rev.rating
        })
        product.ratings = avg / product.reviews.length

        await product.save({ validateBeforeSave: false })
        res.send({ success: success, message: "🎉🎉🎉successfully🎉🎉🎉" })

    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.getAllreviewsOfSingleProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.query.id)
        if (!product) {
            return res.send({ success: (!success), errors: "Product Not Found" })
        }
        res.send({ success: success, message: "🎉🎉🎉successfully🎉🎉🎉", reviews: product.reviews })
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}

exports.deleteReviewer = async (req, res) => {
    try {
        const product = await Products.findById(req.query.productId)
        if (!product) {
            return res.send({ success: (!success), errors: "Product Not Found" })
        }
        const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

        let avg = 0
        reviews.forEach(rev => {
            avg += rev.rating
        })
        const ratings = avg / reviews.length

        const numOfReviews = reviews.length

        await Products.findByIdAndUpdate(req.query.productId, {reviews, ratings, numOfReviews}, {new:true, runValidators:true})

        res.send({ success: success, message: "🎉🎉🎉successfully🎉🎉🎉"})
    } catch (error) {
        console.log(error.message)
        return res.send({ success: (!success), errors: error.message })
    }
}