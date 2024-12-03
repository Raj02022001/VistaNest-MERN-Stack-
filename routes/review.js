const express =  require("express");
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js")

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){ 
       let errmsg=  error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, errmsg)
      } else{
        next();
      }
  };
  

//Review Route
//POST
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  //DELETE
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

  module.exports = router;