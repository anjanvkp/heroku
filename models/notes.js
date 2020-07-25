const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    DT: {
        type: String,
        required: 'This field is required.'
    },
    NOTE: {
        type: String
    },
    usern:{type: String}
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;