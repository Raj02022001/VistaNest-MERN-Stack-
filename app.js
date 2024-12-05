if (process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/VistaNest";
const methodoveride = require("method-override");
const EJSmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const cors = require("cors"); 
const session = require("express-session")
const flash =  require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js")

const listingRoute = require("./routes/listing.js")
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoveride("_method"));
app.engine("ejs", EJSmate)
app.use(express.static(path.join(__dirname,"/public" )))
app.use(cors());

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie :{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (user.authenticate()))


passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error= req.flash("error")
  res.locals.currUser = req.user;
  next();
})

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute)
app.use("/", userRoute);


//Error
app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
  let{statuscode = 500, message="Something went Wrong"} = err;
  res.render("listings/error.ejs", {message});
}
)
app.listen("8080", ()=>{
    console.log("Server is Listening")
})