
// IMPORTS
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const _ = require('lodash');

// GLOBAL VARIABLES
const MUTABLE_DEFAULT_LABEL = 'word';
const REDACTION_LEVELS = 5;



// Each static-word or mutable-user-input of the template is a Word object
class Word{
    constructor(obj, indexOfThisType){
        this.isStatic = obj.isStatic;
        
        if (obj.isStatic){
            this.word = obj.word;
            this.staticIndex = indexOfThisType;
        } else {
            this.label = obj.label;
            this.mutableIndex = indexOfThisType;
        }
    }
}



// Create the Template model
class Template extends Model{
    // Convert string to array of Words
    static fromString(input){
        function getIndicesOfSquareBrackets(){
            var output = [];
            
            let bracketPair = {};
            let closingBracketNext = false;

            for (let i = 0; i < input.length; i++)
                if (input[i] === '['){
                    if (!closingBracketNext){
                        bracketPair.startBracket = i;
                        closingBracketNext = true;
                    } else
                        return undefined;
                } else if (input[i] === ']'){
                    if (closingBracketNext){
                        bracketPair.stopBracket = i;
                        output.push(bracketPair);
                        
                        closingBracketNext = false;
                        bracketPair = {};
                    } else
                        return undefined;
                }
            
            return output;
        }

        function isAlphanumeric(word){
            for (let i = 0; i < word.length; i++){
                let cc = word.charCodeAt(i);
                if ((cc >= 48 && cc <= 57) || (cc >= 65 && cc <= 90) || (cc >= 97 && cc <= 122))
                    return true;
            }
            return false;
        }

        const arr = [];
        input = input.trim();

        const squareBracketIndices =  getIndicesOfSquareBrackets();
        if (!squareBracketIndices)
            throw new Error('Square brackets are not properly formatted');

        const mutables = [];
        let inputNoMutables = input;
        for (const bracketPair of squareBracketIndices){
            let mutableString = input.substring(bracketPair.startBracket + 1, bracketPair.stopBracket);
            mutables.push(mutableString.trim() || MUTABLE_DEFAULT_LABEL);
            inputNoMutables = inputNoMutables.replace(`[${mutableString}]`, '[]');
        }

        const split = inputNoMutables
            .replaceAll('[]', ' [] ')
            .split(' ');
        var staticIndex = 0, mutableIndex = 0;
        for (var word of split){
            word = word.trim();
            if (word)
                if (word === '[]'){
                    arr.push(new Word(
                        {
                            isStatic: false,
                            label: mutables[mutableIndex]
                        },
                        mutableIndex
                    ));
                    mutableIndex++;
                } else {
                    arr.push(new Word(
                        {
                            isStatic: true,
                            word: word
                        },
                            isAlphanumeric(word) ? staticIndex : null
                    ));
                    staticIndex++;
                }
        }

        return {
            contentArr: arr,
            staticCount: staticIndex,
            mutableCount: mutableIndex
        };
    }


    // Create a random order for sequentially redacting every nth element
    static getRedactionOrder(){
        const output = [];
        
        for (let i = 0; i < REDACTION_LEVELS - 1; i++)
            output.push(i);
    
        return _.shuffle(output);
    }
}



// Define table columns + configuration
Template.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.JSON, // this will be an array of Words, and only converted to JSON upon beforeCreate or beforeUpdate (see hooks below)
            allowNull: false,
            unique: true
        },
        staticCount: {
            type: DataTypes.INTEGER
        },
        mutableCount: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1
            }
        },
        redactionOrder: {
            type: DataTypes.JSON // this will be an array of integers, and only converted to JSON upon beforeCreate (see hooks below)
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
        modelName: 'template', // make the table name lowercase in the database
        hooks: {
            beforeCreate: newTemplateData => {
                let processedData = Template.fromString(newTemplateData.content);
                    newTemplateData.content = JSON.stringify(processedData.contentArr);
                    newTemplateData.staticCount = processedData.staticCount;
                    newTemplateData.mutableCount = processedData.mutableCount;

                newTemplateData.redactionOrder = JSON.stringify(Template.getRedactionOrder());

                return newTemplateData;
            },
            beforeFind: queriedTemplateData => {
                queriedTemplateData.content = JSON.parse(queriedTemplateData.content);
                queriedTemplateData.redactionOrder = JSON.parse(queriedTemplateData.redactionOrder);
                return queriedTemplateData;
            }
        }
    }
)



// EXPORT
module.exports = Template;