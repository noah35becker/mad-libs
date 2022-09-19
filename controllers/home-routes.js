
// IMPORTS
const router = require('express').Router();
const {purgeUpdatedAtProperty} = require('../utils/general-helpers');


// ROUTES
router.get('/', async (req, res) => {
    res.render('homepage', {
        loggedIn: false // TESTER: should be 'req.session.loggedIn'
    });
});



// EXPORT
module.exports = router;