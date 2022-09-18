
// IMPORTS
const router = require('express').Router();
const templateRoutes = require('./template-routes');
const fillinRoutes = require('./fillin-routes');
const commentRoutes = require('./comment-routes');

// MIDDLEWARE
router.use('/template', templateRoutes);
router.use('/fillin', fillinRoutes);
router.use('/comment', commentRoutes);

// EXPORT
module.exports = router;