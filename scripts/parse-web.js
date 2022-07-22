const puppeteer = require("puppeteer"); 
const DICT_SOURCES = {
    "mobiledevmemo" : {
        "title"     : ".mdm-content-title h1",
        "images"    : ".wp-block-image img",
        "tnIndex"   : 0,
        "text"      : ".mdm-content-main p",
    },
};

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
    let thumbnail = data_raw.thumbnail;
    let text = data_raw.text
                .map(item => item.trim())           // Remove leading/trailing whitespace
                .filter(item => item.length > 0);    // Remove empty items
                // .join("\n\n");                      // Convert array into 1 long string 

    let data = {
        title       : title,
        thumbnail   : thumbnail,
        text        : text,
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
    
    // Implement the following: 
    // let domain = getWebDomain(webURL);
    // let dict = DICT_SOURCES[domain];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(webURL);

    let dict = DICT_SOURCES["mobiledevmemo"];
    let data = await page.evaluate((dict) => {
        let title = Array.from(
                            document.querySelectorAll(dict.title), 
                            item => item.textContent.trim());
        let images = Array.from(
                            document.querySelectorAll(dict.images),
                            item => item.src);
        let text =  Array.from(
                            document.querySelectorAll(dict.text), 
                            item => item.textContent.trim());
        let data = {
            "title"     : title,
            "thumbnail" : images[dict.tnIndex],
            "text"      : text,
        };
        return data;
    }, dict);
    await browser.close();
    return data;
}

module.exports = {
    parseWeb, 
    filterData,
}

