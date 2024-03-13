const { Schema, model } = require("mongoose");

const opinionSchema = new Schema({
  authorOpinion: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  mediaUrl: { // Updated from 'picture' to 'mediaUrl'
    type: String,
    required: [true, "Media URL is required"]
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
}, {
  timestamps: true
});

module.exports = model("Opinion", opinionSchema);