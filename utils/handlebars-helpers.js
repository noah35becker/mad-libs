
const {DateTime} = require('luxon');
const shuffle = require('lodash.shuffle');


module.exports = {
    format_date: date => DateTime.fromISO(new Date(date).toISOString()).toFormat("MMM d, yyyy 'at' HH:mm:ss"),

    format_plural: (word, quantity) => quantity === 1 ? word : word+'s',

    redaction_string: string => string.replaceAll(' ', '_'),
    
    is_space_char: string => string === ' ',

    redaction_slider_width: redactionLvls => Math.min((redactionLvls + 1) * 33, 225),

    invert_redaction_val: (thisLvl, totalLvls) => totalLvls - thisLvl,

    store_fillin_content: fillinContent => JSON.stringify(fillinContent),

    meta_abbrev: longMetadata => {
        const length = 35;
        var output;

        if (!Array.isArray(longMetadata))
            output = longMetadata.substring(0, length);
        else
            output = longMetadata
                .map(word => `"${word}"`)
                .join(', ')
                .substring(0, length);
        
        if (output.length === length)
            output += '...';
        
        return output;
    },

    compare: (a, b) => a === b,

    random_footer_names_order: () => shuffle([
        {
            name: 'Noah Becker',
            github: 'noah35becker'
        },
        {
            name: 'Claudia Yile',
            github: 'claudiayile'
        },
        {
            name: 'Min Maung',
            github: 'minmaung0307'
        }
    ]).map(({name, github}) =>
        `<a class='footer-link' href='https://github.com/${github}' target='_blank'>${name}</a>`
    ).join(', ')
};