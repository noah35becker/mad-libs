
// IMPORTS
const router = require('express').Router();
const {REDACTION_LEVELS} = require('../utils/global-vars')
const {isLoggedInUrlAuth} = require('../utils/auth');
const {Template, User, Fillin} = require('../models');
const sequelize = require('../config/connection');
const shuffle = require('lodash.shuffle');



// ROUTES

// Template maker
router.get('/maker', isLoggedInUrlAuth, async (req, res) =>
    res.render('template/maker', {
        loggedIn: true,
        pageSubtitle: 'Template maker',
        redactionLvls: REDACTION_LEVELS
    })
);


// View all
router.get('/all', async (req, res) => {
    var dbTemplatesData = await Template.findAll({
        attributes: [
            'id',
            'title',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM fillin WHERE template.id = fillin.template_id)`), 'fillin_count']
        ],
        include: {
            model: User,
            attributes: ['username']
        },
        order: [['created_at', 'DESC']] // the default sort order for Templates, even if req.query.sortBy does NOT === 'mostRecent' (may be shuffled after findAll, see below)
    });

    if (req.query.sortBy === 'random')
        dbTemplatesData = shuffle(dbTemplatesData);

    dbTemplatesData = dbTemplatesData.map(template => template.get({plain: true}));

    res.render('template/all', {
        templates: dbTemplatesData,
        sortBy: req.query.sortBy || 'mostRecent',
        loggedIn: req.session.loggedIn,
        pageSubtitle: 'All templates',
        adminAccess: req.session.username === 'admin'
    })
});


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
        dbTemplateData.fillins = shuffle(dbTemplateData.fillins);
    
    res.render('template/single', {
        template: dbTemplateData,
        loggedIn: req.session.loggedIn,
        pageSubtitle: `Template | ${dbTemplateData.title} (by ${dbTemplateData.user.username})`,
        sortFillinsBy: req.query.sortFillinsBy,
        adminAccess: req.session.username === 'admin'
    });
});



// EXPORT
module.exports = router;