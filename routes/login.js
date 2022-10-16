const passport = require('passport');
const express = require('express');
const router = express.Router();

/* GET login page. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.render('login');
});

/* POST login. */
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;