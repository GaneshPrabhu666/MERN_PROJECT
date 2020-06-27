const express = require("express");
const router = express.Router();
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth");
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");

const {getOrderById, createOrder, getAllOrder, getStatusofOrder, updateOrder } = require("../controllers/order");

// params
router.param("userId", getUserById);
router.param("orderId", getOrderById);


// Create
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//Read
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrder);

//Read order status
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getStatusofOrder);

//update order
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateOrder);

module.exports = router;