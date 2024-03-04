const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const CommentModel = require("../models/Comment.model");
const SubcommentModel = require("../models/Subcomment.model");

router.post("/comments/:commentId/subcomments", isAuthenticated, (req, res, next) => {
  const { commentId } = req.params;

  CommentModel.findById(commentId)
    .then(gettingCommentId => {
      const addSubcomment = {
        bodySubcomment: req.body.bodySubcomment,
        authorSubcomment: req.payload._id
      }

      SubcommentModel.create(addSubcomment)
        .then(newSubcommentId => {
          CommentModel.findByIdAndUpdate(commentId, {$push: {subComments: newSubcommentId._id}}, {returnDocument: "After"})
            .then(displayNewSubcomment => res.json(displayNewSubcomment))
            .catch(e => {
              console.log("error pushing new subcomment")
              res.status(500).json({
                message: "error pushing the new subcomment",
                error: e
              });
            });
        });
    });
});

module.exports = router;
