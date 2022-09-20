
// IMPORTS
const router = require('express').Router();
const {REDACTION_LEVELS} = require('../utils/general-helpers')



// ROUTES

// Template maker
router.get('/maker', async (req, res) => {
    console.log(REDACTION_LEVELS);
    
    res.render('template/maker', {
        loggedIn: true,
        pageSubtitle: 'Template maker',
        redactionLvls: REDACTION_LEVELS
    });
});





// EXPORT
module.exports = router;