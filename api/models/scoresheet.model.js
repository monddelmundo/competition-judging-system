
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoresheetSchema = new Schema({
    church_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'churches'
    },
    judge_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'judges'
    },
    overallMusical: { type: Number, required: true },
    overallLiterary: { type: Number, required: true },
    overallTotal: { type: Number, required: true },
    musical: { type: [{
        competition_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'competitions'
        },
        criterias: [Number]
    }]},
    literary: { type: [{
        competition_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'competitions'
        },
        criterias: [Number]
    }]},
});

const Scoresheet = mongoose.model('Scoresheet', scoresheetSchema);

module.exports = { Scoresheet, scoresheetSchema }