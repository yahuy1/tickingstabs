const express = require("express");
const router = express.Router();
const Result = require("../models/resultModel");

router.post("/", async (req, res) => {
  const result = new Result({
    id: req.body.id,
    user: req.body.user,
    score: req.body.score
  });

  try {
    const newResult = await result.save();
    res
        .status(201)
        .json(newResult)
  } catch (err) {
    res
        .status(400)
        .json({ message: err.message})
  }
})


module.exports = router;