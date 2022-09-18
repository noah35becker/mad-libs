
// IMPORTS
const router = require('express').Router();
const templateRoutes = require('./template-routes');
const fillinRoutes = require('./fillin-routes');

// MIDDLEWARE
router.use('/template', templateRoutes);
router.use('/fillin', fillinRoutes);

// EXPORT
module.exports = router;