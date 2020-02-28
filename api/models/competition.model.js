
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { criteriaSchema } = require('./criteria.model');

const competitionSchema = new Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, trim: true },
    minNoOfPerson: { type: Number, required: true },
    maxNoOfPerson: { type: Number, required: true },
    criterias: [criteriaSchema]
});

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = { Competition, competitionSchema }
