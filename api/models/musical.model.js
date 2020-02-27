const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicalSchema = new Schema({
    name: { type: String, required: true, trim: true },
    criterias: [Number]
});

const Musical = mongoose.model('Musical', musicalSchema);

module.exports = { Musical, musicalSchema }