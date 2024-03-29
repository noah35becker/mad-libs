
// IMPORTS
const router = require('express').Router();
const {Fillin, Template, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const shuffle = require('lodash.shuffle');



// REQUESTS

// Get all
router.get('/', async (req, res) => {
    try{
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
        switch (req.query.sortBy){
            case 'upvotes':
                findParams.order.push(['vote_count', 'DESC']);
            case 'mostRecent':
            default:
                findParams.order.push(['created_at', 'DESC']);
        }
        
        var dbFillinsData = await Fillin.findAll(findParams);

        if (req.query.sortBy === 'random')
            dbFillinsData = shuffle(dbFillinsData);

        dbFillinsData = dbFillinsData.map(fillin => {
            let output = fillin.get({plain: true});
            output.content = JSON.parse(output.content);
            return output;
        });

        res.json(dbFillinsData);
    }catch (err){
        console.log(err);
        res.status(400).json(err);
    }
});


// Get ID of one random fillin
router.get('/random-id', async (req, res) => {
    try{
        var oneRand = await Fillin.findAll({
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
    try{
        var dbFillinData = await Fillin.findByPk(req.params.id, {
            attributes: [
                'id',
                'content',
                'created_at',
                [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE fillin.id = vote.fillin_id)`), 'vote_count']
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
                    },
                }
            ],
            order: [[{model: Comment, as: 'comments'}, 'created_at', 'ASC']]
        });

        if (!dbFillinData){
            res.status(404).json({message: 'No fill-in found with this ID'});
            return;
        }

        dbFillinData = dbFillinData.get({plain: true});
        dbFillinData.content = JSON.parse(dbFillinData.content);
        dbFillinData.template.content = JSON.parse(dbFillinData.template.content);

        res.json(dbFillinData);
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Create new
router.post('/', async (req, res) => {
    try {
        var template = await Template.findByPk(req.body.template_id, {attributes: ['mutable_count']});

        if (template.mutable_count !== req.body.content.length){
            res.status(400).json({message: 'Number of inputs in this Fillin does not match the number of mutables in the template'});
            return;
        }

        var dbFillinData = await Fillin.create({
            content: req.body.content,
            template_id: req.body.template_id,
            user_id: req.session.user_id
        });
     
        dbFillinData = dbFillinData.get({plain: true});
        dbFillinData.content = JSON.parse(dbFillinData.content);

        res.json({
            message: 'Fill-in successfully created',
            fillin: dbFillinData
        });
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Delete
router.delete('/:id', async (req, res) => {
    try{
        const dbFillinData = await Fillin.findByPk(req.params.id);

        if (!dbFillinData){
            res.status(404).json({message: 'No fill-in found with this ID'});
            return;
        }

        await dbFillinData.destroy();
        res.json({message: 'Fill-in successfully deleted'});
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    };
});



// EXPORT
module.exports = router;