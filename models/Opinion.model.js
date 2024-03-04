const { Schema, model, mongoose } = require("mongoose");

const opinionSchema = new Schema (
  {
    authorOpinion: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    picture: {
      type: String,
      required: [true, "Picture is required"]
    },
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    body: {
      type: String,
      required: true
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
  },
  {
    timestamps: true
  }
); 

module.exports = model("Opinion", opinionSchema);