
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { competitionSchema } = require('./competition.model');
const { judgeSchema } = require('./judge.model');
const { churchSchema } = require('./church.model');
const { scoresheetSchema } = require('./scoresheet.model');

const eventSchema = new Schema({
    title: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    dateOfEvent: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    participants: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    accessCode: { type: String, required: true },
    competitions: [competitionSchema],
    judges: [judgeSchema],
    churches: [churchSchema],
    scoresheets: [scoresheetSchema]
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event, eventSchema };