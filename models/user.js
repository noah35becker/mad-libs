const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
//bcrypt
checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
};

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
        },

        async beforeUpdate(updatedUserData){
            updatedUserData.password = await bcrypt.hash(updatedUserData)
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