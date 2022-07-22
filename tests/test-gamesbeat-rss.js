const fs = require("fs");
const path = require("path");
const treeify = require("treeify");
const rss_parser = require("../scripts/parse-rss.js");

async function main() {
    // Fetch RSS data
    const webURL = "http://feeds.feedburner.com/gamesbeat?format=xml";
    const feed = await rss_parser.fetchFeed(webURL);
    const data = rss_parser.parseFeed(feed);
    const data_tree = treeify.asTree(data, true);

    // Write RSS data to .txt file
    const FILE_NAME = "gamesbeat_rss.txt";
    const FILE_PATH  = path.join(__dirname, "results", FILE_NAME);
    fs.writeFile(FILE_PATH, data_tree, (err) => {
        if (err) {
            console.log(`  ❌ Error: ${err}`);
        } else {
            console.log(`✅ Success: written ${FILE_NAME} file`);
        }
    });
}

main();

