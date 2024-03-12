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
      };

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

router.get("/subcomments", (req, res, next) => {
  SubcommentModel.find()
    .then(gettingSubcomments => res.json(gettingSubcomments))
    .catch(e => {
      console.log("error getting subcomments", e)
      res.status(500).json({
        message: "error getting subcomments",
        error: e
      });
    });
});

router.get("/subcomments/:subcommentId", (req, res, next) => {
  const {subcommentId} = req.params;

  SubcommentModel.findById(subcommentId)
    .then(gettingSubcommentId => res.json(gettingSubcommentId))
    .catch(e => {
      console.log("error getting subcomment", e)
      res.status(500).json({
        message: "error getting subcomment",
        error: e
      });
    });
});

router.put("/subcomments/:subcommentId", isAuthenticated, (req, res, next) => {
  const {subcommentId} = req.params;

  const updateSubcommentId = {
    bodySubcomment: req.body.bodySubcomment
  };

  SubcommentModel.findByIdAndUpdate(subcommentId, updateSubcommentId, {new: true})
    .then(updateSubcommentIdResult => res.json(updateSubcommentIdResult))
    .catch(e => {
      console.log("error updating the subcomment")
      res.status(500).json({
        message: "error updating subcomment",
        error: e
      });
    });
});

router.delete("/subcomments/:subcommentId", isAuthenticated, (req, res, next) => {
  const {subcommentId} = req.params;

  SubcommentModel.findByIdAndDelete(subcommentId)
    .then(subcommentId => res.json({message: "success deleting", subcommentId}))
    .catch(e => {
      console.log("error deleting subcomment id")
      res.status(500).json({
        message: "error deleting the subcomment Id",
        error: e
      });
    });
});

module.exports = router;
