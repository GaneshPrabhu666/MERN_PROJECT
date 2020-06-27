const express = require("express");
const router = express.Router();
const { getProductId, createProduct, getProductById,photo, deleteProduct, updateProduct, getAllProducts, getAllUniqeCategories } = require("../controllers/product");
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

router.param("userId",getUserById);
router.param("productId",getProductId);
router.get("/product/:productId",getProductId);

// all of actual routes
//create routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated, isAdmin,createProduct)

// Read routes
router.get("/product/:productId",getProductById);
router.get("/product/photo/:productId", photo);

// Delete Routes
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);

// Update Routes
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

// Listing Routes
router.get("/products",getAllProducts);

router.get("/products/categories",getAllUniqeCategories);

module.exports = router;