const express = require('express')
const { getAllProducts, createProducts, updateProducts, deleteProducts, getProductDetails, createProductReview, getAllreviewsOfSingleProduct, deleteReviewer } = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/admin/products/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProducts)
router.route('/admin/products/:id').put(isAuthenticatedUser,authorizeRoles("admin"), updateProducts).delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProducts)
router.route('/products/:id').get(getProductDetails)
router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(getAllreviewsOfSingleProduct).delete(isAuthenticatedUser, deleteReviewer)
module.exports = router