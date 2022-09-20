
// IMPORTS
const router = require('express').Router();
const {Fillin, Template, User} = require('../models');
const _ = require('lodash');
const sequelize = require('../config/connection');


// ROUTES
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
                break;
        }
        
        var dbFillinsData = await Fillin.findAll(findParams);

        if (req.query.sortBy === 'random')
            dbFillinsData = _.shuffle(dbFillinsData);

        dbFillinsData = dbFillinsData.map(fillin => {
            let output = fillin.get({plain: true});
            output.content = JSON.parse(output.content);
            return output;
        });

        res.render('homepage', {
            loggedIn: req.session.loggedIn,
            fillins: dbFillinsData
        });
    }catch (err){
        console.log(err);
        res.status(400).json(err);
    }
});



// EXPORT
module.exports = router;