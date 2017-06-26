const express = require('express');
const router  = express.Router();
const passport = require("passport");


/* GET DASHBOARD */

router.get('/dashboard', ensureAuth,(req, res) => {
  res.render('dash', {user: req.user});
});

function ensureAuth(){
  if (req.isAuthenticated()){
    console.log('is Authenticated');
    return next();
  }
  else {
    console.log('is NOT Authenticated');
    res.redirect('/');
  }
}

module.exports = router;
