
const {Comment} = require('../../models');

const commentsData = [
    {
        content: 'Great job!',
        user_id: 1,
        fillin_id: 1
    },
    {
        content: 'This is good.',
        user_id: 3,
        fillin_id: 2
    },
    {
        content: 'Ehh, kinda…',
        user_id: 1,
        fillin_id: 3
    },
    {
        content: 'How bout it',
        user_id: 2,
        fillin_id: 4
    }
];

const seedComments = () => Comment.bulkCreate(commentsData);

module.exports = seedComments;