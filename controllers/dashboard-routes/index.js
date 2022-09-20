
// IMPORTS
const router = require('express').Router();
const mainRoute = require('./main-route');
const updateUserInfoRoutes = require('./update-user-info-routes');

// MIDDLEWARE
router.use('/', mainRoute);
router.use('/update-user-info', updateUserInfoRoutes);

// EXPORT
module.exports = router;