const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const literarySchema = new Schema({
    name: { type: String, required: true, trim: true },
    criterias: [Number]
});

const Literary = mongoose.model('Literary', literarySchema);

module.exports = { Literary, literarySchema }