const express = require('express');
const router  = express.Router();
const passport = require("passport");

/* GET home page. */
router.get('/', checkForUserNRedirect(),(req, res, next) => {
  res.render('index', {user: req.user});
});


function checkForUserNRedirect() {
  return function(req, res, next) {
    if (req.user) {
      res.redirect('/dashboard');
    }
    else {
      next();
    }
  };
}
module.exports = router;
