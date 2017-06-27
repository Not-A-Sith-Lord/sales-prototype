const express = require('express');
const router  = express.Router();
const passport = require("passport");
const Lead = require("../models/lead.js");
const User = require("../models/user.js");

/* GET DASHBOARD */

router.get('/', checkRoles('USER'),(req, res) => {
  res.render('dash', {user: req.user, email: req.user.email});
});


router.get("/create-lead", checkRoles('USER'),(req, res, next)=> {
  res.render("create-lead");

});

router.post("/create-lead", (req, res, next)=> {
  const firstName = req.body.firstName;
  const lastName  = req.body.lastName;
  const email     = req.body.email;
  const phone     = req.body.phone;
  const zip       = req.body.zip;
  const address   = req.body.address;
  const city      = req.body.city;
  const company   = req.body.company;
  //Gotta slice keywords into array
  const keywords  = req.body.keywords;
console.log("testing create lead route");
  //For now we'll just search if a lead exists with the same email,
  //However eventually we need to check if this specific user or org has
  //the same lead, via multiple paramaters
  Lead.findOne({ email }, "email", (err, lead) => {
    if (lead !== null) {
      res.redirect("/dashboard", { message: "This lead already exists" });
      return;
    }

    const newLead = Lead({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      zip: zip,
      address: address,
      city: city,
      company: company,
      keywords: ["test", "another test", "yet another test"]
    });
  //New lead is created with a _id here. Now we'll 1. save to DB and
  // 2. Push the ID into the user's leads array

    newLead.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        console.log("/////////////////////////////////////////////////////////////////////////");
        console.log(req.user.leads);
        console.log(newLead._id);
        // const array = req.user.leads;
        // const newLeads = array.push(newLead._id);
        console.log(newLead);
        //Save newLead id to user leads array
        User.findByIdAndUpdate(req.user._id, {
          "$push" : {leads: newLead._id},
        }, (err, response) => {
          console.log(response);
           if (err){
             console.log("Lead saved but not attached to user");
           }
           else {
             res.redirect("/dashboard");
           }
})

        //Redirect to dash

      }
    });

});

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
