const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const criteriaSchema = new Schema({
    title: { type: String, required: true, unique: true, trim: true },
    value: { type: Number, required: true }
});

const Criteria = mongoose.model('Criteria', criteriaSchema);

module.exports = { Criteria, criteriaSchema }