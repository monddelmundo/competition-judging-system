
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { literarySchema } = require('./literary.model');
const { musicalSchema } = require('./musical.model');

const scoresheetSchema = new Schema({
    church_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    },
    judge_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Judge'
    },
    overallMusical: { type: Number, required: true },
    overallLiterary: { type: Number, required: true },
    overallTotal: { type: Number, required: true },
    musical: [musicalSchema],
    literary: [literarySchema]
});

const Scoresheet = mongoose.model('Scoresheet', scoresheetSchema);

module.exports = { Scoresheet, scoresheetSchema }