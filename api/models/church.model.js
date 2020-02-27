
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const churchSchema = new Schema({
    name: { type: String, required: true, trim: true },
    churchNumber: { type: Number, required: true }
});

const Church = mongoose.model('Church', churchSchema);

module.exports = { Church, churchSchema }