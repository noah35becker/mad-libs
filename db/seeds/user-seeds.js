
const {User} = require('../../models');

const usersData = [
    {
        username: 'claudiay',
        email: 'claudiay@gmail.com',
        password: 'claudiapass'
    },
    {
        username: 'noahb',
        email: 'noahb@gmail.com',
        password: 'noahpass'
    },
    {
        username: 'minm',
        email: 'minm@gmail.com',
        password: 'minpass'
    }
];

const seedUsers = () => User.bulkCreate(
    usersData,
    {individualHooks: true}
);

module.exports = seedUsers;