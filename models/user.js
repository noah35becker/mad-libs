
// IMPORTS
const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');


// Create the User model
class User extends Model{
    // Use bcrypt to check password
    async checkPassword(loginPw){
        return await bcrypt.compare(loginPw, this.password);
    }
};

// Define table columns + configuration
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            unique: true, 
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: {
                len: [6] // must be >= 6 chars long
            }
        }
    },
    { // Table configuration options:
        sequelize, // Sequelize connection
        timestamps: false, // don't automatically create created_at / updated_at timestamp fields
        freezeTableName: true, // don't pluralize name of database table
        underscored: true, // use under_scores instead of camelCasing
        modelName: 'user', // make the table name lowercase in the database
        hooks: {
            beforeCreate: async newUserData => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async updatedUserData => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        }
    }
);


// EXPORT
module.exports = User;