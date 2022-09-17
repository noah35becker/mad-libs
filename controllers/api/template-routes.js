
// IMPORTS
const router = require('express').Router();
const {Template, Fillin, User} = require('../../models');



// REQUESTS

// Get all
router.get('/', async (req, res) => {
    try{
        var dbTemplatesData = await Template.findAll({
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
                    // order: [['created_at', 'ASC']]
                }
            ]
        });

        dbTemplatesData = dbTemplatesData.map(template => {
            let output = template.get({plain: true})
            output.content = JSON.parse(output.content);
            output.redaction_order = JSON.parse(output.redaction_order);
            return output;
        });

        res.json(dbTemplatesData);
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Get one NORMAL
router.get('/:id', async (req, res) => {
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

        dbTemplateData = dbTemplateData.get({plain: true});
        dbTemplateData.content = JSON.parse(dbTemplateData.content);
        dbTemplateData.redaction_order = JSON.parse(dbTemplateData.redaction_order);

        res.json(dbTemplateData);
    }catch (err){
        console.log(err);
        res.status(404).json(err);
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
        var dbTemplateData = await Template.create({
            title: req.body.title,
            content: req.body.content,
            user_id: 1 // TESTER; should really be: 'user_id: req.session.user_id'
        });
     
        dbTemplateData = dbTemplateData.get({plain: true});
        dbTemplateData.content = JSON.parse(dbTemplateData.content);
        dbTemplateData.redaction_order = JSON.parse(dbTemplateData.redaction_order);

        res.json({
            message: 'Template successfully created',
            template: dbTemplateData
        });
    }catch (err){
        console.log(err);
        res.status(400).json(err);
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