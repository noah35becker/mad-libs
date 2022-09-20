
// IMPORTS
const router = require('express').Router();
const {REDACTION_LEVELS} = require('../utils/general-helpers')
const {isLoggedInUrlAuth} = require('../utils/auth');



// ROUTES

// Template maker
router.get('/maker', isLoggedInUrlAuth, (req, res) => {
    res.render('template/maker', {
        loggedIn: true,
        pageSubtitle: 'Template maker',
        redactionLvls: REDACTION_LEVELS
    });
});





// EXPORT
module.exports = router;