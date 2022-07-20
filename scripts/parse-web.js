const puppeteer = require("puppeteer"); 

/**
    * Filters contents of an article by applying the following steps: 
    *  (1) Convert arrays into strings
    *  (2) Remove leading/trailing whitespaces 
    *  (3) Separates paragraphs with blank lines for better visiblity
    *
    * @param   {array}  data_raw : String array containing contents of an article
    * @return  {array}  data     : String array containing filtered contents of an article
    */
function filterData(data_raw) {
    let title = data_raw.title.join();
    let text = data_raw.text
                .map(item => item.trim())           // Remove leading/trailing whitespace
                .filter(item => item.length > 0)    // Remove empty items
                .join("\n\n");                      // Convert array into 1 long string 

    let data = {
        title: title,
        text: text,
    };
    return data;
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

    let data_raw = await page.evaluate(() => {
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
    data = filterData(data_raw);
    await browser.close();
    return data;
}

module.exports = {
    parseWeb, 
    filterData,
}

