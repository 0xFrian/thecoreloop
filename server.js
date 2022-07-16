// Express Server
const web_parser = require("./scripts/web-scraping.js");
const rss_parser = require("./scripts/rss-feed.js");
const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// let webURL = "https://venturebeat.com/2022/07/07/red-dead-online-scales-back-support/";

app.get("/", async (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    let webURL = req.body.webURL;
    if (webURL.length == 0) {
        console.log("Going back to home page...");
        res.render("index");
    } else {
        console.log(`Obtaining content from ${webURL}...`);
        // Parse web content
        let content = await web_parser.parseWeb(webURL);
        web_parser.printContent(content);
        
        // Parse RSS content
        // let content = await rss_parser.parseRSS(webURL);
        // console.log(content);

        res.render("results", {
            webURL: req.body.webURL,
            content: content,
        });
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

