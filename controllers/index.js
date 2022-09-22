
// IMPORTS
const router = require('express').Router();
const homeRoute = require('./home-route');
const dashboardRoutes = require('./dashboard-routes');
const templateRoutes = require('./template-routes');
const fillinRoute = require('./fillin-route');
const apiRoutes = require('./api');

// MIDDLEWARE
router.use('/', homeRoute);
router.use('/dashboard', dashboardRoutes);
router.use('/template', templateRoutes);
router.use('/fillin', fillinRoute);
router.use('/api', apiRoutes);
router.use((req, res) => res.status(404).redirect('/'));

// EXPORT
module.exports = router;