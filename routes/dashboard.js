const express = require('express');
const router  = express.Router();
const passport = require("passport");
const Lead = require("../models/lead.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

/* GET DASHBOARD */

router.get('/', checkRoles('USER'),(req, res) => {
  //If the user has no leads skip all these calls
  if (req.user.leads){

  const queryArray = [];
  //Loop through list of leads IDs and build query array
  (req.user.leads).forEach((lead) => {
    queryArray.push(mongoose.Types.ObjectId(lead))
  });


  Lead.find({
    '_id': { $in: queryArray}   //Search with query array
}, (err, docs) => {
     res.render('dash', {
       user: req.user,
       email: req.user.email,
       leads : docs //Load dash with lead docs
     });
});
}
  else {
     res.render('dash', {user: req.user, email: req.user.email});
}
});

router.get("/create-lead", checkRoles('USER'),(req, res, next)=> {
  res.render("create-lead");
});

router.post("/create-lead", (req, res, next)=> {


  //For now we'll just search if a lead exists with the same email,
  //However eventually we need to check if this specific user or org has
  //the same lead, via multiple paramaters
  const email = req.body.email;
  Lead.findOne({ email }, "email", (err, lead) => {
    if (lead !== null) {
      res.redirect("/dashboard", { message: "This lead already exists" });
      return;
    }

    const newLead = Lead({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      zip: req.body.zip,
      address: req.body.address,
      city: req.body.city,
      company: req.body.company,
      keywords: req.body.keywords.split(", ") //convert to array
    });
  //New lead is created with a _id here. Now we'll 1. save to DB and
  // 2. Push the ID into the user's leads array

    newLead.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {

        //Save newLead id to user leads array
        User.findByIdAndUpdate(req.user._id, {
          "$push" : {leads: newLead._id},
        }, (err, response) => {
          console.log(response);
           if (err){
             console.log("Lead saved but not attached to user");
           }
           else {
               //Redirect to dash
             res.redirect("/dashboard");
           }
         });
         //End find and update
      }
      //End else if no save erorr
    });
    //End Save
});
//End Find One
});
//End of Create Lead

//Can we refactory this somewhere? Just looks busy
function checkRoles(role){
  return function(req, res, next){
    if(req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      console.log('not Auth');
      res.redirect('/');
    }
  };
}

module.exports = router;
