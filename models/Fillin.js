
// IMPORTS
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');



// Create the Fillin model
class Fillin extends Model{}



// Define table columns + configuration
Fillin.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        template_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'template',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.JSON, // this will be an array of strings, and only converted to JSON upon beforeCreate or beforeUpdate (see hooks below)
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    { // Table configuration options:
        sequelize, // Sequelize connection
        freezeTableName: true, // don't pluralize name of database table
        underscored: true, // use under_scores instead of camelCasing
        modelName: 'fillin', // make the table name lowercase in the database
        hooks: {
            beforeCreate: newFillinData => {
                newFillinData.content = JSON.stringify(newFillinData.content);
                return newFillinData;
            }
        }
    }
)



// EXPORT
module.exports = Fillin;