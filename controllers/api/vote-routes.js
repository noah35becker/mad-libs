
// IMPORTS
const router = require('express').Router();
const {Vote} = require('../../models');
const sequelize = require('../../config/connection');



// REQUESTS

// Check if a given User voted for a given Fillin
router.get('/check', async (req, res) => {
    try{
        var dbVotesData = await Vote.findAll({
            where: {fillin_id: req.query.fillinId},
            attributes: ['user_id']
        });

        dbVotesData = dbVotesData.map(vote => vote.get({plain: true}).user_id);

        res.json({
            message: dbVotesData.includes(req.session.user_id),
            vote_count: dbVotesData.length
        });
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Create new
router.post('/', async (req, res) => {
    try{
        const dbVoteData = await Vote.create({
            user_id: req.session.user_id,
            fillin_id: req.body.fillin_id
        });

        res.json({
            message: 'Vote successfully created',
            comment: dbVoteData
        });
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Delete
router.delete('/', async (req, res) => {
    try{
        await Vote.destroy({
            where: {
                user_id: req.session.user_id,
                fillin_id: req.body.fillin_id
            }
        });

        res.json({message: 'Vote successfully deleted'});
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});



// EXPORT
module.exports = router;