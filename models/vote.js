
// IMPORTS
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');


// Create the Vote model
class Vote extends Model {}


// Define table columns + configuration
Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        fillin_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            references: {
                model: 'fillin',
                key: 'id'
            }
        },
    }, 
    {
        sequelize, // Sequelize connection
        timestamps: false, // don't automatically create createdAt / updatedAt timestamp fields
        freezeTableName: true, // don't pluralize name of database table
        underscored: true, // uses under_scores instead of camelCasing
        modelName: 'vote', // make the model name be lowercase in the database
    }
)


// EXPORT
module.exports = Vote; 