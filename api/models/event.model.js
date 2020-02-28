
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    dateOfEvent: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    participants: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    accessCode: { type: String, required: true }
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event, eventSchema };