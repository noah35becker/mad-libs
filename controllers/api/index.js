
// IMPORTS
const router = require('express').Router();
const templateRoutes = require('./template-routes');

// MIDDLEWARE
router.use('/template', templateRoutes);

// EXPORT
module.exports = router;