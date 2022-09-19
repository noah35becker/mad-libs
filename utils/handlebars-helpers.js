
const {DateTime} = require('luxon');


module.exports = {
    format_date: date => {
        return DateTime.fromISO(new Date(date).toISOString()).toFormat("MMM d, yyyy 'at' HH:mm:ss");
    },

    format_plural: (word, quantity) => quantity === 1 ? word : word+'s',

    redaction_string: string => string.replaceAll(' ', '_'),
    
    is_space_char: string => string === ' ',

    redaction_slider_width: redactionLvls => Math.min((redactionLvls + 1) * 33, 225),

    invert_redaction_val: (thisLvl, totalLvls) => totalLvls - thisLvl,

    compare: (a, b) => a === b
};