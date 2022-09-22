
// IMPORTS
const router = require('express').Router();
const {Fillin, Template, User} = require('../models');
const _ = require('lodash');
const sequelize = require('../config/connection');


// ROUTE
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

        res.render('homepage', {
            sortFillinsBy: req.query.sortFillinsBy || 'mostRecent',
            fillinsPool: 'all',
            loggedIn: req.session.loggedIn,
            fillins: dbFillinsData,
            adminAccess: req.session.username === 'admin'
        });
    }catch (err){
        console.log(err);
        res.status(400).json(err);
    }
});



// EXPORT
module.exports = router;