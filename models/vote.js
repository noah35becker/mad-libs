const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model { 
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

         voteType: { type: Sequelize.BOOLEAN, allowNull:false },
         [Sequelize.literal("(SELECT COUNT(*) FROM Votes WHERE fillinId=fillin.id AND Votes.voteType=true)"), "upVote"],
         [Sequelize.literal("(SELECT COUNT(*) FROM Votes WHERE fillinId=fillin.id AND Votes.voteType=false)"), "downVote"]

    }, 
    sequelize, 
        timestamps: false, 
        freezeTableName: true, 
        underscored: true, 
        modelName: 'vote'
    

)
module.exports = Vote; 
