const puppeteer = require("puppeteer"); 

/**
    * Parses through string array, separating each entry with 1 newline-character ("\n")
    *
    * @param   {array}  text             : String array containing text content 
    * @return  {array}  textArr_filtered : String array containing filtered text content
    */
function filterText(text_raw) {
    text_raw = text_raw.map(item => item.trim()); // Remove leading/trailing whitespace
    let text = [];
    for (let i = 0; i < text_raw.length; i++) {
        let line = text_raw[i];
        if (line.length > 0) {
            text.push(text); 
        }
    }
    return text;
}

/**
    * Parses through JSON object representing an article, console-logging its properties: 
    *  title and content
    *
    * @param   {object}  content : Object containing article's title and content
    * @return  {none}
    */
function printContent(content) {
    console.log("Title: ");
    console.log(content.title.join() + "\n");
    console.log("Content: ");
    console.log(content.text.join("\n\n"));
}

/**
    * Parses an article's textual content given its website URL
    *
    * @param   {string}  webURL  : String representing the article's website URL
    * @return  {object}  content : Object containing title and content of an article
    */
async function parseWeb(webURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(webURL);

    let content = await page.evaluate(() => {
        let title = Array.from(
                        document.querySelectorAll("h1.article-title"), 
                        item => item.textContent);
        let text = Array.from(
                        document.querySelectorAll("div.article-content p"), 
                        item => item.textContent);
        let content = {
            "title" : title,
            "text"  : text,
        };
        return content;
    });
    content.text = filterText(content.text);
    await browser.close();
    return content;
}

module.exports = {
    parseWeb, 
    filterText,
    printContent,
}

