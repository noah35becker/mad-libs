const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model { 
    isLinkedToFillin(FillinId){
        return FillinId === this.Fillin_id;
    }
    isLinkedToUser(userId){
        return userId === this.user_id;
    }
}

Vote.init(
    {id: {
        type: DataType.INTEGER,
        allowNull: false,
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
    sequelize, 
        timestamps: false, 
        freezeTableName: true, 
        underscored: true, 
        modelName: 'vote'
    

)
module.exports = Vote; 
