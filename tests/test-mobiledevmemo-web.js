const fs = require("fs");
const path = require("path");
const web_parser = require("../scripts/parse-web.js");

async function main() {
    // Fetch web data
    let webURL = "https://mobiledevmemo.com/why-mediation-is-the-primary-front-in-the-mobile-advertising-wars-post-att/";
    let data_raw = await web_parser.parseWeb(webURL);
    let data = web_parser.filterData(data_raw);
    let data_string = data.title + "\n\n"
                        + data.thumbnail + "\n\n" 
                        + data.text.join("\n\n");
    
    // Write web data to .txt file
    const FILE_NAME = "mobiledevmemo_web.txt";
    const FILE_PATH = path.join(__dirname, "results", FILE_NAME);
    fs.writeFile(FILE_PATH, data_string, (err) => {
        if (err) {
            console.log(`  ❌ Error: ${err}`);
        } else {
            console.log(`✅ Success: written ${FILE_NAME} file`);
        }
    });
}

main();


