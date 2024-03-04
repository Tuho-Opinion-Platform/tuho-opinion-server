const { Schema, model, mongoose } = require("mongoose");

const commentSchema = new Schema(
  {
    authorComment: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    bodyComment: {
      type: String,
      required: true
    },
    subComments: [{
     type: Schema.Types.ObjectId,
     ref: "Subcomment"
    }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Comment", commentSchema);