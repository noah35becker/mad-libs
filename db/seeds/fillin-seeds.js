
const {Fillin} = require('../../models');

const fillinsData = [
    {
        template_id: 1,
        content: ['Jeeves', 'spelunk', 'waterpark', 'Saturday'],
        user_id: 2
    },
    {
        template_id: 2,
        content: ['Cucumbers', 'aardvarks'],
        user_id: 2
    },
    {
        template_id: 3,
        content: ['handbags', 'ugliest'],
        user_id: 3
    },
    {
        template_id: 4,
        content: ['giraffe', 'cordially'],
        user_id: 1
    }
];

const seedFillins = () => Fillin.bulkCreate(
    fillinsData,
    {individualHooks: true}
);

module.exports = seedFillins;