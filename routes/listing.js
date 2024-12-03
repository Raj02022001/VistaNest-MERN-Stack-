const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingschema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner, isOwned} = require("../middleware.js")
const ListingController = require("../controller/listing.js")
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })



//Validating
const validateListing = (req, res, next) => {
  // Merge file data into req.body.listing if a file is uploaded
  if (req.file) {
    const { path: url, filename } = req.file;
    req.body.listing = {
      ...req.body.listing,
      image: { url, filename },
    };
  }

  const { error } = listingschema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

router.route("/")
.get( wrapAsync(ListingController.index)) //Index Route
.post(isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
   wrapAsync(ListingController.createListing)) //Create Route 


//New Route
router.get("/new", isLoggedIn, ListingController.renderNerForm)

router.route("/:id")
.get( wrapAsync(ListingController.showListing)) //Show Route

.put(isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing ,
  wrapAsync(ListingController.updateListing)) //Update Route

.delete(isLoggedIn,
  isOwner, 
  wrapAsync(ListingController.deleteListing)) //Delete Route

//Edit Route
router.get("/:id/edit",
  isLoggedIn, 
  isOwner,
  wrapAsync(ListingController.editListing))

module.exports= router;