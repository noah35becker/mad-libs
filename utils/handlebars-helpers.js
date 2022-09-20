
const {DateTime} = require('luxon');


module.exports = {
    format_date: date => DateTime.fromISO(new Date(date).toISOString()).toFormat("MMM d, yyyy 'at' HH:mm:ss"),

    format_plural: (word, quantity) => quantity === 1 ? word : word+'s',

    redaction_string: string => string.replaceAll(' ', '_'),
    
    is_space_char: string => string === ' ',

    redaction_slider_width: redactionLvls => Math.min((redactionLvls + 1) * 33, 225),

    invert_redaction_val: (thisLvl, totalLvls) => totalLvls - thisLvl,

    store_fillin_content: fillinContent => JSON.stringify(fillinContent),

    fillin_info_content_abbrev: fillinContent => {
        const length = 35;
        
        var output = fillinContent
            .map(word => `"${word}"`)
            .join(', ')
            .substring(0, length);
        
        if (output.length === length)
            output += '...';
        
        return output;
    },

    compare: (a, b) => a === b
};