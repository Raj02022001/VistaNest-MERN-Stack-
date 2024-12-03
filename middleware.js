const listing = require("./models/listing.js")
const Review = require("./models/review.js")


module.exports.isLoggedIn = (req,res,next)=>{
  // console.log(req.user)
    if(!req.isAuthenticated()){
      req.session.redirectedUrl= req.originalUrl;
        req.flash("error", "Please Login First")
        return res.redirect("/login")
      }
      next();
}

module.exports.savedRedirectedUrl = (req,res,next)=>{
  if(req.session.redirectedUrl){
    res.locals.redirectedUrl= req.session.redirectedUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
  let listing = await listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the Owner of this listing")
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review){
    req.flash("error","Review not found")
    return res.redirect(`/listing/${id}`)
  }
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You did not created this review")
    return res.redirect(`/listings/${id}`);
  }
  next();
}