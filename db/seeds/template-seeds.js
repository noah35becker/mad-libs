
const {Template} = require('../../models');

const templatesData = [
    {
        title: 'Template #1',
        content: 'Hello, my name is [noun]. I like to go [verb]ing in the [noun] on [day of week].',
        user_id: 1
    },
    {
        title: 'Template #2',
        content: '[Plural noun] are my favorite types of [plural noun]. I\'m a big, big fan!',
        user_id: 2
    },
    {
        title: 'Template #3',
        content: 'The [plural noun] are [superlative] in the early spring.',
        user_id: 2
    },
    {
        title: 'Template #4',
        content: 'My favorite topping for pizza is [noun]. I love it [adverb], and that\'s just the way it is.',
        user_id: 3
    }
];

const seedTemplates = async () => {
    for (const template of templatesData){
        await Template.create(template);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

module.exports = seedTemplates;