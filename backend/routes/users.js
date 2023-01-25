const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/", async (req, res) => {
  const user = new User({
    id: req.body.id,
    user: req.body.user,
    score: req.body.score
  });

  try {
    const newUser = await user.save();
    res
        .status(201)
        .json(newUser)
  } catch (err) {
    res
        .status(400)
        .json({ message: err.message})
  }
})


module.exports = router;