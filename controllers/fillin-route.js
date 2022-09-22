
// IMPORTS
const router = require('express').Router();
const {Fillin, Template, User, Comment} = require('../models');
const _ = require('lodash');
const sequelize = require('../config/connection');


// ROUTE
router.get('/:id', async (req, res) => {
    var dbFillinData = await Fillin.findByPk(req.params.id, {
        attributes: [
            'id',
            'content',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE fillin.id = vote.fillin_id)`), 'vote_count'],
        ],
        include: [
            {
                model: Template,
                attributes: ['id', 'title', 'content'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['id', 'username']
            },
            {
                model: Comment,
                as: 'comments',
                attributes: ['id', 'content', 'created_at'],
                include: {
                    model: User,
                    attributes: ['id', 'username']
                }
            }
        ],
        order: [[{model: Comment, as: 'comments'}, 'created_at', 'ASC']]
    });

    dbFillinData = dbFillinData.get({plain: true});
    dbFillinData.content = JSON.parse(dbFillinData.content);
    dbFillinData.template.content = JSON.parse(dbFillinData.template.content);

    res.render('fillin-single', {
        loggedIn: req.session.loggedIn,
        fillin: dbFillinData,
        adminAccess: req.session.username === 'admin',
        currentUserId: req.session.user_id
    });
});



// EXPORT
module.exports = router;