
// IMPORTS
const router = require('express').Router();
const {Template, Fillin, User} = require('../../models');
const sequelize = require('../../config/connection');
const shuffle = require('lodash.shuffle');



// REQUESTS

// Get all
router.get('/', async (req, res) => {
    try{
        var dbTemplatesData = await Template.findAll({
            attributes: ['id', 'title', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                },
                {
                    model: Fillin,
                    attributes: ['id', 'created_at'],
                    as: 'fillins',
                    include: {
                        model: User,
                        attributes: ['id', 'username']
                    }
                }
            ],
            order: [
                ['created_at', 'DESC'], // the default sort order for Templates, even if req.query.sortBy does NOT === 'mostRecent' (may be shuffled after findAll, see below)
                [{model: Fillin, as: 'fillins'}, 'created_at', 'DESC'] // the default sort order for Fillins within each template
            ]
        });

        if (req.query.sortBy === 'random')
            dbTemplatesData = shuffle(dbTemplatesData);

        dbTemplatesData = dbTemplatesData.map(template => template.get({plain: true}));

        res.json(dbTemplatesData);
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Get ID of one random template
router.get('/random-id', async (req, res) => {
    try{
        var oneRand = await Template.findAll({
            order: sequelize.random(),
            limit: 1,
            attributes: ['id']
        });

        oneRand = oneRand[0].get({plain: true});

        res.json({rand_id: oneRand.id});
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Get one
router.get('/:id', async (req, res) => {
    try {
        const findParams = {
            attributes: ['id', 'title', 'content', 'static_count', 'mutable_count', 'redaction_order', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
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
                        attributes: ['id', 'username']
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
            res.status(404).json({message: 'No template found with this ID'});
            return;
        }

        if (+req.query.redactionLvl)
            dbTemplateData = dbTemplateData.redactContent(+req.query.redactionLvl);
        
        dbTemplateData = dbTemplateData.get({plain: true});
        dbTemplateData.content = JSON.parse(dbTemplateData.content);
        dbTemplateData.redaction_order = JSON.parse(dbTemplateData.redaction_order);
        dbTemplateData.fillins = dbTemplateData.fillins.map(fillin => {
            fillin.content = JSON.parse(fillin.content);
            return fillin;
        });

        if (req.query.sortFillinsBy === 'random')
            dbTemplateData.fillins = shuffle(dbTemplateData.fillins);

        res.json(dbTemplateData);
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Preview one
router.post('/preview', async (req, res) => {
    try {
        var templateInstance;

        if (req.query.templateId){
            templateInstance = await Template.findByPk(+req.query.templateId, {
                attributes: ['title', 'content', 'redaction_order', 'static_count', 'mutable_count'],
                include: [{
                    model: User,
                    attributes: ['id']
                }]
            });
        } else {
            if (!req.body.title){
                res.status(400).json({message: "Title is missing"})
                return;
            }

            templateInstance = Template.build({
                title: req.body.title,
                content: req.body.content,
                user_id: req.session.user_id
            });
            
            // Mimic the beforeCreate hook
            let processedData = Template.fromString(templateInstance.content);
                templateInstance.content = JSON.stringify(processedData.contentArr);
                templateInstance.static_count = processedData.static_count;
                templateInstance.mutable_count = processedData.mutable_count;
            templateInstance.redaction_order = JSON.stringify(
                    req.body.redaction_order
                ||
                    Template.getRedactionOrder()
            );
        }

        if (+req.query.redactionLvl)
            templateInstance = templateInstance.redactContent(+req.query.redactionLvl);
        
        templateInstance = templateInstance.get({plain: true});
        templateInstance.content = JSON.parse(templateInstance.content);
        templateInstance.redaction_order = JSON.parse(templateInstance.redaction_order);

        res.json(templateInstance);
    }catch (err){
        console.log(err);
        res.status(400).json({message: err.message});
    }
});


// Get one REDACTED
router.get('/redacted/:id', async (req, res) => {
    try {
        var dbTemplateData = await Template.findByPk(req.params.id, {
            attributes: ['id', 'title', 'content', 'static_count', 'mutable_count', 'redaction_order', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'],
                },
                {
                    model: Fillin,
                    attributes: ['id', 'created_at'],
                    as: 'fillins',
                    include: {
                        model: User,
                        attributes: ['id', 'username'],
                    },
                    // order: [['createdAt', 'ASC']]
                }
            ]
        });

        dbTemplateData = dbTemplateData
            .redactContent(+req.query.lvl)
            .get({plain: true});
        dbTemplateData.content = JSON.parse(dbTemplateData.content);
        dbTemplateData.redaction_order = JSON.parse(dbTemplateData.redaction_order);

        res.json(dbTemplateData);
    }catch (err){
        console.log(err);
        res.status(404).json(err);
    }
});


// Create new
router.post('/', async (req, res) => {
    try {
        if (!req.body.title){
            res.status(400).json({message: "Title is missing"})
            return;
        }

        var dbTemplateData = await Template.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });
     
        dbTemplateData = dbTemplateData.get({plain: true});
        dbTemplateData.content = JSON.parse(dbTemplateData.content);
        dbTemplateData.redaction_order = JSON.parse(dbTemplateData.redaction_order);

        res.json({
            message: 'Template successfully created',
            template: dbTemplateData
        });
    } catch (err){
        console.log(err);
        res.status(400).json({message: err.message});
    }
});


// Delete
router.delete('/:id', async (req, res) => {
    try{
        const dbTemplateData = await Template.findByPk(req.params.id);

        if (!dbTemplateData){
            res.status(404).json({message: 'No template found with this ID'});
            return;
        }

        await dbTemplateData.destroy();
        res.json({message: 'Template successfully deleted'});
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    };
});



// EXPORT
module.exports = router;