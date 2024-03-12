const router = require("express").Router();
const OpinionModel = require("../models/Opinion.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

// Adjusted file upload route for clarity and functionality
router.post("/upload", fileUploader.single("media"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Assume req.file.path contains the URL for the uploaded media
  res.json({ mediaUrl: req.file.path });
}, (error, req, res, next) => {
  if (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.post("/opinions", isAuthenticated, fileUploader.single("media"), (req, res, next) => {
  const { title, body } = req.body;

  // Extracting the media URL from the file uploaded
  const mediaUrl = req.file ? req.file.path : '';
  if (!mediaUrl) {
    return res.status(400).json({ message: "Please provide a media file (photo or video)." });
  }

  const newOpinion = {
    authorOpinion: req.payload._id,
    mediaUrl, // Use mediaUrl instead of picture
    title,
    body
  };

  OpinionModel.create(newOpinion)
    .then(displayNewOpinion => res.json(displayNewOpinion))
    .catch(err => {
      console.error("Error creating a new opinion", err);
      res.status(500).json({
        message: "Error creating a new opinion",
        error: err
      });
    });
});

router.get("/opinions", (req, res, next) => {

  OpinionModel.find()
    .populate({path: "authorOpinion", select: "-password"})
    .populate({
      path: "comments", 
      select: "-password", 
      populate: {
        path: "authorComment", 
        select: "-password"
      }
    })
    .populate({
      path: "comments",
      populate: {
        path: "subComments",
        populate: {
          path: "authorSubcomment",
          select: "-password"
        }
      }
    })
    .then(gettingOpinions => res.json(gettingOpinions))
    .catch(e => {
      console.log("error getting the opinions")
      res.status(500).json({
        message: "error getting the opinions",
        error: e
      })
    })
});

router.get("/opinions/:opinionId", (req, res, next) => {
  const { opinionId } = req.params;

  OpinionModel.findById(opinionId)
    .populate({path: "authorOpinion", select: "-password"})
    .populate({
      path: "comments", 
      select: "-password", 
      populate: {
        path: "authorComment", 
        select: "-password"
      }
    })
    .populate({
      path: "comments",
      populate: {
        path: "subComments",
        populate: {
          path: "authorSubcomment",
          select: "-password"
        }
      }
    })
    .then(gettingOpinionId => res.json(gettingOpinionId))
    .catch(e => {
      console.log("error getting opinion Id")
      res.status(500).json({
        message: "error getting the opinion Id",
        error: e
      });
    });
});

router.put("/opinions/:opinionId", isAuthenticated, fileUploader.single("media"), (req, res, next) => {
  const { opinionId } = req.params;
  const { title, body } = req.body;
  
  const updateOpinionBody = {};
  if (title) updateOpinionBody.title = title;
  if (body) updateOpinionBody.body = body;

  if (req.file) {
    updateOpinionBody.mediaUrl = req.file.path;
  }

  OpinionModel.findByIdAndUpdate(opinionId, updateOpinionBody, { new: true })
    .then(updatedOpinion => res.json(updatedOpinion))
    .catch(e => {
      console.error("Error updating the opinion:", e);
      res.status(500).json({
        message: "Error updating the opinion",
        error: e
      });
    });
});


router.delete("/opinions/:opinionId", isAuthenticated, (req, res, next) => {
  const { opinionId } = req.params;

  OpinionModel.findByIdAndDelete(opinionId)
    .then(deletingOpinion => res.json({ message: "You have successfully deleted the opinion id", deletingOpinion}))
    .catch(e => {
      console.log("error deleting the opinion")
      res.status(500).json({
        message: "error deleting the id",
        error: e
      });
    });
});

module.exports = router;