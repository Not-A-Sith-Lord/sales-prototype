const express = require('express');
const router  = express.Router();
const passport = require("passport");


/* GET DASHBOARD */

router.get('/dashboard', checkRoles('USER'),(req, res) => {
  res.render('dash', {user: req.user, email: req.user.email});
});


router.get("/dashboard/create-lead", (err, req, res, next)=> {
  res.render("create-lead");

});

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
