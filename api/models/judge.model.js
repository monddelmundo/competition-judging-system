
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { scoresheetSchema } = require('./scoresheet.model');

const judgeSchema = new Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    firstName: { type: String, required: true, trim: true },
    middleInitial: { type: String, required: true, trim: true, maxlength: 1 },
    lastName: { type: String, required: true, trim: true },
    accessCode: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    scoresheets: [scoresheetSchema]
});

const Judge = mongoose.model('Judge', judgeSchema);

module.exports = { Judge, judgeSchema }