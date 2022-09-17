const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model { 
}

Comment.init(
    {id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }
    comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1]
        }
    },
    template_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: 'template',
            key: 'id'
        }
    }

    }, 
    sequelize, 
        timestamps: false, 
        freezeTableName: true, 
        underscored: true, 
        modelName: 'Comment'
    

)
module.exports = Comment; 
