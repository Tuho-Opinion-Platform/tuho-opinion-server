const router = require("express").Router();
const OpinionModel = require("../models/Opinion.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

// This below codes are to test the upload route
router.post("/upload", fileUploader.single("picture"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ picture: req.file.path });
}, (error, req, res, next) => {
  if (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/opinions", isAuthenticated, fileUploader.single("picture"), (req, res, next) => {
  const {picture, title, body} = req.body;

  const newOpinion = {
    authorOpinion: req.payload._id,
    picture: picture,
    title: title,
    body: body
  };

  if(picture === "") {
    res.status(400).json({message: "Please provide a picture"});
    return;
  } 

  OpinionModel.create(newOpinion)
    .then(displayNewOpinion => res.json(displayNewOpinion))
    .catch(e => {
      console.log("error creating a new opinion", err);
      res.status(500).json({
        message: "error creating a new opinion",
        error: e
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

router.put("/opinions/:opinionId", isAuthenticated, fileUploader.single("picture"), (req, res, next) => {
  const { opinionId } = req.params;
  const { title, body, picture } = req.body;

  // Construct the update object
  const updateOpinionBody = {
    ...(title && { title }),
    ...(body && { body }),
    ...(picture && { picture })
  };

  OpinionModel.findByIdAndUpdate(opinionId, updateOpinionBody, {new: true})
    .then(updateOpinion => res.json(updateOpinion))
    .catch(e => {
      console.log("error updating the opinion")
      res.status(500).json({
        message: "error updating the opinion",
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