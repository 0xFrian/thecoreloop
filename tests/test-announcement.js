const treeify = require("treeify");
const path = require("path");
const fs = require("fs");
const ann_parser = require("../scripts/parse-announcement.js");

async function main() {
    const READ_PATH = path.join(__dirname, "..", "public", "announcements", "07-21-2022.txt");
    console.log(READ_PATH);
    const content = ann_parser.readAnnouncement(READ_PATH);
    const announcement = ann_parser.parseAnnouncement(content);
    const announcement_tree = treeify.asTree(announcement, true);

    const FILE_NAME = "announcement-json-tree.txt";
    const WRITE_PATH = path.join(__dirname, "..", "public", FILE_NAME);
    // const FILE_NAME = "announcement-json-tree.txt";
    // const WRITE_PATH = path.join(__dirname, "results", FILE_NAME);
    fs.writeFile(WRITE_PATH, announcement_tree, (err) => {
        if (err) {
            console.log(`  ❌ Error: ${err}`);
        } else {
            console.log(`✅ Success: written ${FILE_NAME} file`);
        }
    });
}

main();

