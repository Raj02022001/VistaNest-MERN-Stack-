const Listing = require("../models/listing.js");
const Review = require("../models/review.js")

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);  // Add the review to the listing
  
    await newReview.save();
    await listing.save();  // Save the updated listing
    console.log("New review saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
  };

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
  };