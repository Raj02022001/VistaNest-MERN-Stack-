const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

module.exports.renderNerForm = (req,res)=>{
    res.render("listings/new.ejs")
  }  

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).
    populate({
      path:"reviews",
      populate: {
        path: "author",
      }
    }).
    populate("owner");
    if (!listing){
      req.flash("error", "Listing you are looking for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
    console.log(listing)
    };

module.exports.editListing = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
      req.flash("error", "Listing you are looking for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing})
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing})
   req.flash("success", "Listing Updated");
   res.redirect("/listings")
  };

module.exports.createListing = async (req,res,next) => {
  let url = req.file.path;
  let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner =  req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  };

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  };