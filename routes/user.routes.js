const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.get("/users", isAuthenticated, (req, res, next) => {

  User.find()
    .select("-password")
    .then(gettingUsers => res.json(gettingUsers))
    .catch(e => {
      console.log("error getting users", e)
      res.status(500).json({
        message: "error getting users",
        error: e
      });
    });
});

module.exports = router