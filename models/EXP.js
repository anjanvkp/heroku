const mongoose = require('mongoose');

const EXPSchema = new mongoose.Schema({
    rid: {type: String},
    dt: {type: Date},
    mode: {type: String},
    pto: {type: String},
    head: {type: String},
    grp: {type: String},
    amt: {type: String},
    purp: {type: String},
    usern: {type: String},
    type: {type: String}
});

const EXP = mongoose.model('EXP', EXPSchema);

module.exports = EXP;