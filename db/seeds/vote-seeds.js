
const {Vote} = require('../../models');

const votesData = [
    {
        user_id: 1,
        fillin_id: 1
    },
    {
        user_id: 3,
        fillin_id: 2
    },
    {
        user_id: 1,
        fillin_id: 2
    },
    {
        user_id: 2,
        fillin_id: 3
    },
    {
        user_id: 2,
        fillin_id: 4
    },
    {
        user_id: 3,
        fillin_id: 4
    }
];

const seedVotes = () => Vote.bulkCreate(votesData);

module.exports = seedVotes;