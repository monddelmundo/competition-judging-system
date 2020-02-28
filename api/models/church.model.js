
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const churchSchema = new Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    name: { type: String, required: true, trim: true },
    churchNumber: { type: Number, required: true },
    participants: { type: [{
        competition_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'competitions'
        },
        persons: { type: [{
            name: { type: String, trim: true},
            age: { type: Number },
            dateSaved: { type: Date},
            dateBaptized: { type: Date}
        }]}
    }]}
});

const Church = mongoose.model('Church', churchSchema);

module.exports = { Church, churchSchema }