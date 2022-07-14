// Express Server

const path = require("path");

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.send("Welcome to thecoreloop!");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
