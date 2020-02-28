
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    musical: { type: [{
        name: { type: String, trim: true },
        criterias: [Number]
    }]},
    literary: { type: [{
        name: { type: String, trim: true },
        criterias: [Number]
    }]},
});

const Scoresheet = mongoose.model('Scoresheet', scoresheetSchema);

module.exports = { Scoresheet, scoresheetSchema }