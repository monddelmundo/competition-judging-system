const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const churchSchema = new Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
    name: { type: String, required: true, trim: true },
    churchNumber: { type: Number },
    acronym: { type: String, required: true, trim: true },
    participants: {
      type: [
        {
          competition_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "competitions",
          },
          firstName: { type: String, trim: true },
          middleInitial: { type: String, trim: true },
          lastName: { type: String, trim: true },
          age: { type: Number },
          dateSaved: { type: String },
          dateBaptized: { type: String },
        },
      ],
    },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

const Church = mongoose.model("Church", churchSchema);

module.exports = { Church, churchSchema };
