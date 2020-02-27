
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const judgeSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    middleInitial: { type: String, required: true, trim: true, maxlength: 1 },
    lastName: { type: String, required: true, trim: true },
    accessCode: { type: String, required: true, trim: true }
});

const Judge = mongoose.model('Judge', judgeSchema);

module.exports = { Judge, judgeSchema }