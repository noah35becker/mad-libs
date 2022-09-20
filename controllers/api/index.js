
// IMPORTS
const router = require('express').Router();
const templateRoutes = require('./template-routes');
const fillinRoutes = require('./fillin-routes');
const commentRoutes = require('./comment-routes');
const voteRoutes = require('./vote-routes');

// MIDDLEWARE
router.use('/template', templateRoutes);
router.use('/fillin', fillinRoutes);
router.use('/comment', commentRoutes);
router.use('/vote', voteRoutes);

// EXPORT
module.exports = router;