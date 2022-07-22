// Express Server
const web_parser = require("./scripts/parse-web.js");
const rss_parser = require("./scripts/parse-rss.js");
const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// let webURL = "https://venturebeat.com/2022/07/07/red-dead-online-scales-back-support/";

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    res.render("index");
})

app.post("/rss-results", async (req, res) => {
    let webURL = req.body.webURL;
    if (webURL.length == 0) {
        console.log("Going back to home page...");
        res.render("index");
    } else {
        console.log(`Fetching web content from ${webURL}...`);
        // Parse web content
        let resultsFile = "web-results";
        let data_raw = await web_parser.parseWeb(webURL);
        let data = web_parser.filterData(data_raw);

        res.render(resultsFile, {
            webURL: req.body.webURL,
            content: data,
        });
    }
});

app.post("/web-results", async (req, res) => {
    let webURL = req.body.webURL;
    if (webURL.length == 0) {
        console.log("Going back to home page...");
        res.render("index");
    } else {
        console.log(`Fetching RSS feed from ${webURL}...`);
        // Parse RSS content
        let resultsFile = "rss-results";
        let feed = await rss_parser.fetchFeed(webURL);
        let content = rss_parser.parseFeed(feed);

        res.render(resultsFile, {
            webURL: req.body.webURL,
            content: data,
        });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

