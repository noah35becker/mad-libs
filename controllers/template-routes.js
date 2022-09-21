
// IMPORTS
const router = require('express').Router();
const {REDACTION_LEVELS} = require('../utils/general-helpers')
const {isLoggedInUrlAuth} = require('../utils/auth');
const {Template, User, Fillin} = require('../models');
const sequelize = require('../config/connection');
const _ = require('lodash');



// ROUTES

// Template maker
router.get('/maker', isLoggedInUrlAuth, async(req, res) =>
    res.render('template/maker', {
        loggedIn: true,
        pageSubtitle: 'Template maker',
        redactionLvls: REDACTION_LEVELS
    })
);


// Single template
router.get('/:id', async (req, res) => {
    const findParams = {
        attributes: ['id', 'title', 'content', 'redaction_order', 'static_count', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Fillin,
                attributes: [
                    'id',
                    'created_at',
                    'content',
                    [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE vote.fillin_id = fillins.id)`), 'vote_count'],
                    [sequelize.literal(`(SELECT COUNT(*) FROM comment WHERE fillins.id = comment.fillin_id)`), 'comment_count']
                ],
                as: 'fillins',
                include: {
                    model: User,
                    attributes: ['username']
                },
            }
        ]
    };

    findParams.order = [];
    switch (req.query.sortFillinsBy){
        case 'upvotes':
            findParams.order.push([sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE vote.fillin_id = fillins.id)`), 'DESC']);
        case 'mostRecent':
        default:
            findParams.order.push([{model: Fillin, as: 'fillins'}, 'created_at', 'DESC']);
    }

    var dbTemplateData = await Template.findByPk(req.params.id, findParams);

    if (!dbTemplateData){
        res.status(404).end();
        location.replace('/');
        return;
    }

    dbTemplateData = dbTemplateData.redactContent();
    
    dbTemplateData = dbTemplateData.get({plain: true});
    dbTemplateData.content = JSON.parse(dbTemplateData.content);
    dbTemplateData.redaction_order = JSON.parse(dbTemplateData.redaction_order);
    dbTemplateData.fillins = dbTemplateData.fillins.map(fillin => {
        fillin.content = JSON.parse(fillin.content);
        return fillin;
    });

    if (req.query.sortFillinsBy === 'random')
        dbTemplateData.fillins = _.shuffle(dbTemplateData.fillins);
    
    res.render('template/single', {
        template: dbTemplateData,
        loggedIn: req.session.loggedIn,
        pageSubtitle: `${dbTemplateData.title} (by ${dbTemplateData.user.username})`
    });
});



// EXPORT
module.exports = router;