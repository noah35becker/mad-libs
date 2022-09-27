
// IMPORTS
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const _ = require('lodash');

// GLOBAL VARIABLES
const MUTABLE_DEFAULT_LABEL = 'word';
const {REDACTION_LEVELS} = require('../utils/global-vars'); // not including zero-redaction



// Each static-word or mutable-fillin-input of the template is a Word object
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

        // Confirm that square brackets are formatted properly
        let squareBrackets = input.match(/[\[\]]/g);
        if (!squareBrackets || squareBrackets.length < 2)
                throw new Error('There must be at least one fill-in field');    
        squareBrackets.forEach((element, index) => {
            if (
                    squareBrackets.length % 2 !== 0
                ||
                    (!(index % 2) && element !== '[') // even-indexed
                ||
                    (index % 2 && element !== ']') // odd-indexed
            )
                throw new Error('Square brackets are not properly formatted');
        });

        // Parse string into mutables, static words, static punctuations (non-spaces), static punctutations (spaces)
        input = input.trim();
        const split = input.match(RegExp(/\[.*?\]|[a-z0-9']+|[^a-z0-9'\[\]\s]+|\s+/ig));
        
        // Create the appropriate type of Word object for each parsed element
        const contentArr = [];
        var staticIndex = 0, mutableIndex = 0;
        for (var elem of split){
            if (elem.charAt(0) === '[')
                contentArr.push(new Word(
                    {
                        isStatic: false,
                        label: elem.substring(1, elem.length - 1).trim() || MUTABLE_DEFAULT_LABEL
                    },
                    mutableIndex++
                ));
            else {
                contentArr.push(new Word(
                    {
                        isStatic: true,
                        word: (elem.trim() ? elem : ' ')
                    },
                        /[a-z0-9]/i.test(elem) ? staticIndex++ : null
                ));
            }
        }

        // Return relevant variables
        return {
            contentArr,
            static_count: staticIndex,
            mutable_count: mutableIndex
        };
    }


    // Create a random order for sequentially redacting every nth element
    static getRedactionOrder(){
        const output = [];
        
        for (let i = 0; i < REDACTION_LEVELS; i++)
            output.push(i);
    
        return _.shuffle(output);
    }


    // Return this template with its "content" redacted to the level of redactionLvl (0 = no redaction)
    redactContent(redactionLvl){
        var redactedContent = JSON.parse(this.content);
        let redaction_order = JSON.parse(this.redaction_order);

        if (!redactionLvl)
            redactionLvl = redaction_order.length;
    
        for (let i = 0; i < redactionLvl; i++){
            for (let r = redaction_order[i]; r < this.static_count; r += redaction_order.length){
                let wordIndex = redactedContent.findIndex(elem => elem.staticIndex === r);
                let word = redactedContent[wordIndex].word;
                let redactedSpaces = '';
                for (let x = 1; x <= word.length; x++)
                    redactedSpaces += ' ';    
                
                redactedContent[wordIndex] = {
                    isRedacted: true,
                    redactedString: redactedSpaces
                }
            }
        }

        this.content = JSON.stringify(redactedContent);

        return this;
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
            type: DataTypes.JSON, // this will be an array of Words, and only converted to JSON upon beforeCreate (see hook below)
            allowNull: false
        },
        static_count: {
            type: DataTypes.INTEGER
        },
        mutable_count: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1
            }
        },
        redaction_order: {
            type: DataTypes.JSON // this will be an array of integers, and only converted to JSON upon beforeCreate (see hook below)
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
                    newTemplateData.static_count = processedData.static_count;
                    newTemplateData.mutable_count = processedData.mutable_count;

                newTemplateData.redaction_order = JSON.stringify(Template.getRedactionOrder());

                return newTemplateData;
            }
        }
    }
)



// EXPORT
module.exports = Template;