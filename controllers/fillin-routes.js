
// IMPORTS
const router = require('express').Router();
const {Fillin, Template, User, Comment} = require('../models');
const _ = require('lodash');
const sequelize = require('../config/connection');


// ROUTES

// View all
router.get('/all', async (req, res) => {
    const findParams = {
        attributes: [
            'id',
            'content',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE fillin.id = vote.fillin_id)`), 'vote_count'],
            [sequelize.literal(`(SELECT COUNT(*) FROM comment WHERE fillin.id = comment.fillin_id)`), 'comment_count']
        ],
        include: [
            {
                model: Template,
                attributes: ['id', 'title']
            },
            {
                model: User,
                attributes: ['id', 'username']
            }
        ]
    };

    findParams.order = [];
    switch (req.query.sortFillinsBy){
        case 'upvotes':
            findParams.order.push(['vote_count', 'DESC']);
        case 'mostRecent':
        default:
            findParams.order.push(['created_at', 'DESC']);
    }
    
    var dbFillinsData = await Fillin.findAll(findParams);

    if (req.query.sortFillinsBy === 'random')
        dbFillinsData = _.shuffle(dbFillinsData);

    dbFillinsData = dbFillinsData.map(fillin => {
        let output = fillin.get({plain: true});
        output.content = JSON.parse(output.content);
        return output;
    });

    res.render('fillin/all', {
        sortFillinsBy: req.query.sortFillinsBy || 'mostRecent',
        loggedIn: req.session.loggedIn,
        fillins: dbFillinsData,
        adminAccess: req.session.username === 'admin'
    });
});


// Single fillin
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

    console.log(dbFillinData.comments);

    res.render('fillin/single', {
        loggedIn: req.session.loggedIn,
        fillin: dbFillinData,
        adminAccess: req.session.username === 'admin',
        currentUserId: req.session.user_id
    });
});



// EXPORT
module.exports = router;