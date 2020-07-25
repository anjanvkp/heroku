const mongoose = require('mongoose');

const licSchema = new mongoose.Schema({
    rid: {
        type: String,
        required: 'This field is required.'
    },
    CANAME: {
        type: String
    },
    CANO: {
        type: String
    },
    LOANO: {
        type: String
    },
    SDATE: {
        type: String
    },
    EDATE: {
        type: String
    },
    VAL: {
        type: String
    },
    usern: {
        type: String
    }
});

const LIC = mongoose.model('LIC', licSchema);

module.exports = LIC;