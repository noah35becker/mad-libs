
// IMPORTS
const router = require('express').Router();
const {Vote} = require('../../models');



// REQUEST

// Check if a given User voted for a given Fillin
router.get('/check', async (req, res) => {
    try{
        var dbVoteData = await Vote.findOne({
            where: {
                user_id: +req.session.user_id,
                fillin_id: +req.query.fillinId
            }
        });

        res.json({status: (dbVoteData ? true : false)});
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});



// EXPORT
module.exports = router;