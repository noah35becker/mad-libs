
// IMPORTS
const Template = require('./Template');
const Fillin = require('./Fillin');
const User = require('./User');
const Comment = require('./Comment');
const Vote = require('./Vote');



// ASSOCIATIONS

Template.hasMany(Fillin, {
    foreignKey: 'template_id',
    as: 'fillins'
});

Fillin.belongsTo(Template, {
    foreignKey: 'template_id',
    onDelete: 'CASCADE'
});


Template.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

User.hasMany(Template, {
    foreignKey: 'user_id',
    as: 'templates'
});


User.hasMany(Fillin, {
    foreignKey: 'user_id',
    as: 'fillins'
});

Fillin.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});


Fillin.hasMany(Comment, {
    foreignKey: 'fillin_id',
    as: 'comments'
});

Comment.belongsTo(Fillin, {
    foreignKey: 'fillin_id',
    onDelete: 'CASCADE'
});


Fillin.belongsToMany(User, {
    through: Vote,
    as: 'voted_fillins',
    foreignKey: 'fillin_id'
});

User.belongsToMany(Fillin, {
    through: Vote,
    as: 'voted_fillins',
    foreignKey: 'user_id'
});



// EXPORTS
module.exports = {Template, Fillin, User, Comment, Vote};