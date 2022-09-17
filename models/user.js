const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
//bcrypt
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash)
// Store hash in your password DB
});

Users.init(
    { id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        primaryKey: true, 
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
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
        //
        }
    }
    },
    {
    hooks: {
        async beforeCreate(userData) {
            newUserData.password = await bcrypt.hash(userData.password, 10).then(newUserData => {
                return newUserData
            });
        }

    },
     sequelize, 
        timestamps: false, 
        freezeTableName: true, 
        underscored: true, 
        modelName: 'user'
    }
);

module.exports = User; 