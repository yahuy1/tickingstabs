const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

const resultsRouter = require("./routes/results");
app.use("/api/results", resultsRouter);

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
    res.send("Home");
})

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err))