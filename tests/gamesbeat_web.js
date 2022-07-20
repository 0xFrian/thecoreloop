const fs = require("fs");
const path = require("path");
const web_parser = require("../scripts/parse-web.js");

async function main() {
    let webURL = "https://venturebeat.com/2022/07/18/riot-games-and-aws-are-teaming-up-to-deliver-fresh-esports-content/" ;
    let data = await web_parser.parseWeb(webURL);
    let data_string = data.title + "\n\n" + data.text;

    console.log("Web Data: ");
    const FILE_NAME = "gamesbeat_web.md";
    const FILE_PATH = path.join(__dirname, "results", FILE_NAME);
    fs.writeFile(FILE_PATH, data_string, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`✅ Success: written ${FILE_NAME} file`);
        }
    });
}

main();
