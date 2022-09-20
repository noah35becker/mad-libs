
// IMPORTS
const router = require('express').Router();
const {Vote} = require('../../models');



// REQUESTS

// Check if a given User voted for a given Fillin
router.get('/check', async (req, res) => {
    try{
        var dbVoteData = await Vote.findOne({
            where: {
                user_id: +req.session.user_id,
                fillin_id: +req.query.fillinId
            }
        });

        res.json({message: (dbVoteData ? true : false)});
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Create new
router.post('/', async (req, res) => {
    try{
        const dbVoteData = await Vote.create({
            user_id: +req.session.user_id,
            fillin_id: req.body.fillinId
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
                user_id: +req.session.user_id,
                fillin_id: req.body.fillinId
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