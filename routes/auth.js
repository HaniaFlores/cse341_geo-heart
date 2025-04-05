﻿const express = require('express');
const router = express.Router();

const passport = require("passport");


router.get('/login', passport.authenticate('github', {scope: ['user:email']}), () => {
    // #swagger.ignore = true
});
router.get('/callback', passport.authenticate('github', {
    // #swagger.ignore = true
    failureRedirect: '/',
    session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/api-docs');
});
router.get('/logout', (req, res, next) => {
    // #swagger.tags=['OAuth']
    // #swagger.summary = 'Logout'
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
})

module.exports = router;