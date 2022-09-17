
// IMPORTS
const seedUsers = require('./template-seeds');
const seedTemplates = require('./template-seeds');
const seedFillins = require('./fillin-seeds');
const seedComments = require('./comment-seeds');
const seedVotes = require('./vote-seeds');

const sequelize = require('../../config/connection');


// FUNCTION
const seedAll = async () => {
    await sequelize.sync({force: true});
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedTemplates();
    console.log('\n----- TEMPLATES SEEDED -----\n');

    await seedFillins();
    console.log('\n----- FILLINS SEEDED -----\n');

    await seedComments();
    console.log('\n----- COMMENTS SEEDED -----\n');

    await seedVotes();
    console.log('\n----- VOTES SEEDED -----\n');

    process.exit(0);
};


// RUN
seedAll();