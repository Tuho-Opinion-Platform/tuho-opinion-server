const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const CommentModel = require("../models/Comment.model");
const OpinionModel = require("../models/Opinion.model");

router.post("/opinions/:opinionId/comments", isAuthenticated, (req, res, next) => {
  const { opinionId } = req.params;

  OpinionModel.findById(opinionId)
    .then(gettingOpinionId => {
      const addComment = {
        bodyComment: req.body.bodyComment,
        authorComment: req.payload._id,
      };

      console.log(addComment, "add comment")

      CommentModel.create(addComment)
        .then(newCommentId => {
          OpinionModel.findByIdAndUpdate(opinionId, {$push: {comments: newCommentId._id}}, {returnDocument: "after"})
            .populate({
              path: "comments", 
              select: "-password", 
              populate: {path: "authorComment", select: "-password"} })
            .then(displayNewComment => res.json(displayNewComment))
            .catch(e => {
              console.log("error pushing new comment")
              res.status(500).json({
                message: "error pushing the new comment",
                error: e
              });
            });
        });
    });
});

router.get("/comments", (req, res, next) => {

  CommentModel.find()
    .populate({
      path: "subComments",
      select: "-password",
      populate: {path: "authorSubcomment", select: "-password"}
    })
    .then(gettingComments => res.json(gettingComments))
    .catch(e => {
      console.log("error getting the list of the comment", e)
      res.status(500).json({
        message: "error getting the list of the comment",
        error: e
      });
    });
});

router.get("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  CommentModel.findById(commentId)
    .populate({
      path: "subComments",
      select: "-password",
      populate: {path: "authorSubcomment", select: "-password"}
    })
    .then(gettingCommentId => res.json(gettingCommentId))
    .catch(e => {
      console.log("error getting the comment Id", e)
      res.status(500).json({
        message: "error getting the comment Id",
        error: e
      });
    });
});

router.put("/comments/:commentId", isAuthenticated, (req, res, next) => {
  const { commentId } = req.params;

  const updateCommentId = {
    bodyComment: req.body.bodyComment
  };

  CommentModel.findByIdAndUpdate(commentId, updateCommentId, {new: true})
    .then(updateCommentId => res.json(updateCommentId))
    .catch(e => {
      console.log("error updating the comment Id", e)
      res.status(500).json({
        message: "error updating the comment Id",
        error: e
      });
    });
});

router.delete("/comments/:commentId", isAuthenticated, (req, res, next) => {
  const { commentId } = req.params;

  CommentModel.findByIdAndDelete(commentId)
    .then(resultOfDeletingCommentId => res.json({message: "you have successfully deleted the comment Id", resultOfDeletingCommentId}))
    .catch(e => {
      console.log("error deleting the comment Id", e)
      res.status(500).json({
        message: "error deleting the comment Id",
        error: e
      });
    });
});

module.exports = router;