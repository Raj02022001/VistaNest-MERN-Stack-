const user = require("../models/user.js")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.singupUser = async(req,res)=>{
    try{
        let{username,email,password} = req.body
    let newUser = new user({email,username});
    const registeredUser = await user.register(newUser , password);
    // console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if (err){
            next(err)
        }
        req.flash("success", "Welcome to VistaNest");
        res.redirect("/listings");
    });
   
    } catch(error){
        req.flash("error", error.message);
        res.redirect("/signup")
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")};

module.exports.LoginForm =  async(req,res)=>{
    req.flash("success","Successfully Logged In")
    let redirectedUrl = res.locals.redirectedUrl || "/listings"
    res.redirect(redirectedUrl)
};    

module.exports.Logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success", "You are Logged Out")
        res.redirect("/listings")
    })
}