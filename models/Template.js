
// IMPORTS
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const _ = require('lodash');

// GLOBAL VARIABLES
const MUTABLE_DEFAULT_LABEL = 'word';
const REDACTION_LEVELS = 4; // not including zero-redaction



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
        const arr = [];
        input = input.trim();

        let squareBrackets = input.match(/[\[\]]/ig);
        if (!squareBrackets || squareBrackets.length < 2)
                throw new Error('There must be at least one mutable');    
        squareBrackets.forEach((element, index) => {
            if (
                    (!(index % 2) && element !== '[') // even-indexed
                ||
                    (index % 2 && element !== ']') // odd-indexed
            )
                throw new Error('Square brackets are not properly formatted');
        });

        const mutables = [];
        const mutablesRegExp = RegExp(/\[((?!\[).)*\]/, 'ig');
        let mutableLabel;
        const indexPairsToRemove = [];

        while ((mutableLabel = mutablesRegExp.exec(input)) !== null){
            mutables.push(
                    mutableLabel[0].slice(1, -1).trim()
                ||
                    MUTABLE_DEFAULT_LABEL
            );
            indexPairsToRemove.push([mutablesRegExp.lastIndex - mutableLabel[0].length + 1, mutablesRegExp.lastIndex - 1]);
        }

        let inputNoMutables = input;
        _.forEachRight(indexPairsToRemove, value => 
            inputNoMutables =
                inputNoMutables.substring(0, value[0])
                + inputNoMutables.substring(value[1])
        );

        const split = inputNoMutables.match(RegExp(/[\[\]]{2}|\b[a-z0-9']+\b|((?!\[\]|\s+)\W)+/, 'ig'));
        var staticIndex = 0, mutableIndex = 0;
        for (var elem of split){
            if (elem === '[]'){
                arr.push(new Word(
                    {
                        isStatic: false,
                        label: mutables[mutableIndex]
                    },
                    mutableIndex
                ));
                mutableIndex++;
            } else
                arr.push(new Word(
                    {
                        isStatic: true,
                        word: elem
                    },
                        /[A-Za-z0-9]/.test(elem) ? staticIndex++ : null
                ));
        }

        return {
            contentArr: arr,
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
            type: DataTypes.JSON, // this will be an array of Words, and only converted to JSON upon beforeCreate (see hooks below)
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






// TEST
var testTemplate = {
	"id": 1,
	"title": "Template #1",
	"content": [
		{
			"isStatic": true,
			"word": "Hello,",
			"staticIndex": 0
		},
		{
			"isStatic": true,
			"word": "my",
			"staticIndex": 1
		},
		{
			"isStatic": true,
			"word": "name",
			"staticIndex": 2
		},
		{
			"isStatic": true,
			"word": "is",
			"staticIndex": 3
		},
		{
			"isStatic": false,
			"label": "noun",
			"mutableIndex": 0
		},
		{
			"isStatic": true,
			"word": ".",
			"staticIndex": null
		},
		{
			"isStatic": true,
			"word": "I",
			"staticIndex": 4
		},
		{
			"isStatic": true,
			"word": "like",
			"staticIndex": 5
		},
		{
			"isStatic": true,
			"word": "to",
			"staticIndex": 6
		},
		{
			"isStatic": true,
			"word": "go",
			"staticIndex": 7
		},
		{
			"isStatic": false,
			"label": "verb",
			"mutableIndex": 1
		},
		{
			"isStatic": true,
			"word": "ing",
			"staticIndex": 8
		},
		{
			"isStatic": true,
			"word": "in",
			"staticIndex": 9
		},
		{
			"isStatic": true,
			"word": "the",
			"staticIndex": 10
		},
		{
			"isStatic": false,
			"label": "noun",
			"mutableIndex": 2
		},
		{
			"isStatic": true,
			"word": "on",
			"staticIndex": 11
		},
		{
			"isStatic": false,
			"label": "day of week",
			"mutableIndex": 3
		},
		{
			"isStatic": true,
			"word": ".",
			"staticIndex": null
		}
	],
	"static_count": 12,
	"mutable_count": 4,
	"redaction_order": [
		2,
		3,
		1,
		0
	],
	"created_at": "2022-09-17T20:41:33.000Z",
	"updated_at": "2022-09-17T20:41:33.000Z",
	"user": {
		"id": 1,
		"username": "claudiay"
	},
	"fillins": [
		{
			"id": 4,
			"created_at": "2022-09-17T20:41:33.000Z",
			"user": {
				"id": 2,
				"username": "noahb"
			}
		}
	]
}



