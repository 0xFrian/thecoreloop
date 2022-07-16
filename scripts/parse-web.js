const puppeteer = require("puppeteer"); 

/**
    * Parses through string array, separating each entry with 1 newline-character ("\n")
    *
    * @param {array} textArr : String array containing text content (raw/unfiltered)
    * @return {array} textArr_filtered : String array containing filtered text content
    */
function filterText(textArr) {
    let textArr_copy = textArr.map(item => item.trim()); // Remove leading/trailing whitespace
    let textArr_filt = [];
    for (let i = 0; i < textArr_copy.length; i++) {
        let text = textArr_copy[i];
        if (text.length > 0) {
            textArr_filt.push(text); 
        }
    }
    return textArr_filt;
}

/**
    * Parses through JSON object representing an article, console-logging its properties: title and content
    *
    * @param {object} content : Object containing title and content of an article
    * @return {none}
    */
function printContent(content) {
    console.log("Title: ");
    console.log(content.title.join() + "\n");
    console.log("Content: ");
    console.log(content.text.join("\n\n"));
}

/**
    * Scrapes textual content from an article given its website URL
    *
    * @param {string} websiteURL : String representing the article's website URL
    * @return {object} content : Object containing title and content of an article
    */
async function scrapeWebsite(websiteURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(websiteURL);

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
    scrapeWebsite, 
    filterText,
    printContent,
}

