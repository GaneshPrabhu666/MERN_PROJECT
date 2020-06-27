var express = require("express");
var router = express.Router();
const { check } = require('express-validator');
const {signout, signup, signin,isSignedIn} = require('../controllers/auth')

router.post("/signup",[
    check("name","name should be atleast 3 characters").isLength({min: 3}),
    check("email","email is required").isEmail(),
    check("password","password atleast 3 characters").isLength({min:3})
], signup);

router.post(
    "/signin",[
    check("email","email is required").isEmail(),
    check("password","password field is required").isLength({min:3})
], signin);

router.get("/signOut", signout);

router.get("/testroute",isSignedIn,(req,res) =>{
res.json(req.auth);
});
module.exports = router;