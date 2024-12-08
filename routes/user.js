const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectedUrl } = require("../middleware.js");
const userController = require("../controller/user.js");


router.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.singupUser));


router.route("/login") 
.get(userController.renderLoginForm)
.post(
    savedRedirectedUrl,
     passport.authenticate('local', 
    { failureRedirect: '/login',
failureFlash: true,
}),
   userController.LoginForm);

router.get("/logout", userController.Logout);
    
module.exports=router;