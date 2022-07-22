const fs = require("fs");
const path = require("path");
const treeify = require("treeify");
const web_parser = require("./parse-web.js");
const lag_parser = require("./parse-announcement.js");

const FILE_NAME_LAG = "07-21-2022.txt"
const READ_PATH = path.join(__dirname, "..", "public/", "announcements/", FILE_NAME_LAG);
const announcement = lag_parser.readAnnouncement(READ_PATH);
const lag = lag_parser.parseAnnouncement(announcement);

async function main() {
    let tcl = [];
    let categories = [];
    for (let i = 0; i < lag.content.length; i++) {
        let categoryGroup = lag.content[i];
        let category = categoryGroup.category;
        let articles = categoryGroup.articles;
        let categoryGroup_meta = [];
        for (let j = 0; j < articles.length; j++) {
            let article = articles[j];
            let webContent = await web_parser.parseWeb(article.link);
            webContent = web_parser.filterData(webContent);
            let article_meta = {
                title       : webContent.title,
                thumbnail   : webContent.thumbnail,
                caption     : article.caption,
                link        : article.link,
            };
            categoryGroup_meta.push(article_meta);
        }
        categories.push(category);
        tcl.push(categoryGroup_meta);
    }
    const tcl_tree = treeify.asTree(tcl, true);

    const FILE_NAME_TCL = "tcl-json-tree.txt";
    const WRITE_PATH = path.join(__dirname, "..", "public", FILE_NAME_TCL)
    fs.writeFile(WRITE_PATH, tcl_tree, (err) => {
        if (err) {
            console.log(`  ❌ Error: ${err}`);
        } else {
            console.log(`✅ Success: written ${FILE_NAME_TCL} file`);
        }
    });
}

main();

