const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    res.render('index', { title: `Welcome random ${req.user.email.includes('agency') ? 'agency' : 'admin'}` });
});

module.exports = router;