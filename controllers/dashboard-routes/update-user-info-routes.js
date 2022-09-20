
// IMPORTS
const router = require('express').Router();
const {isLoggedInUrlAuth} = require('../../utils/auth');



// Update password
router.get('/password', isLoggedInUrlAuth, (req, res) => {
    res.render('update-user-info/password', {
        loggedIn: true,
        pageSubtitle: 'Update password'
    });
});


// Update username
router.get('/username', isLoggedInUrlAuth, (req, res) => {
    res.render('update-user-info/username', {
        loggedIn: true,
        pageSubtitle: 'Update username'
    });
});


// Update email
router.get('/email', isLoggedInUrlAuth, (req, res) => {
    res.render('update-user-info/email', {
        loggedIn: true,
        pageSubtitle: 'Update email'
    });
});


// Delete account
router.get('/delete-account', isLoggedInUrlAuth, (req, res) => {
    res.render('update-user-info/delete-account', {
        loggedIn: true,
        pageSubtitle: 'Delete account'
    });
});



// EXPORT
module.exports = router;