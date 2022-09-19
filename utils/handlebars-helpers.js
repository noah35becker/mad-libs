
const {DateTime} = require('luxon');


module.exports = {
    format_date: date => {
        return DateTime.fromISO(new Date(date).toISOString()).toFormat("MMM d, yyyy 'at' HH:mm:ss");
    },

    format_plural: (word, quantity) => quantity === 1 ? word : word+'s',

    redaction_slider_width: redactionLvls => Math.min((redactionLvls + 1) * 26, 200), 

    compare: (a, b) => a === b
};