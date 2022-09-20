
// IMPORTS
const router = require('express').Router();
const homeRoutes = require('./home-routes');
const templateRoutes = require('./template-routes');
// const apiRoutes = require('./api');

// MIDDLEWARE
router.use('/', homeRoutes);
router.use('/template', templateRoutes);
// router.use('/api', apiRoutes);
router.use((req, res) => res.status(404).redirect('/'));

// EXPORT
module.exports = router;