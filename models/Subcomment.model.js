const { mongoose, Schema, model } = require("mongoose");

const subcommentSchema = new Schema(
  {
    authorSubcomment: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    bodySubcomment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Subcomment", subcommentSchema)