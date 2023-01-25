const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        min: 1,
        required: true
    }
})

module.exports = mongoose.model("Result", resultSchema);
 