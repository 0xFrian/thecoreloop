// Scraping websites

// ===== Import packages =====
const puppeteer = require("puppeteer"); 

// ===== Helper function: filter raw text content =====
function filterText(articleText) {
    let copyText = articleText.join("\n").split("\n");
    copyText = copyText.map(item => item.trim());
    let filteredText = [];
    for (let i = 0; i < copyText.length; i++) {
        let item = copyText[i];
        if (item.length > 0) {
            filteredText.push(item); 
        }
    }
    return filteredText;
}

// ===== Helper function: print list of content =====
function printContent(content) {
    console.log("Title: ");
    console.log(content.title.join() + "\n");
    console.log("Content: ");
    console.log(content.text.join("\n\n"));
}

// ===== Main function: scrape article for text content =====
async function scrapeWebsite(websiteURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(websiteURL);

    let content = await page.evaluate(() => {
        let title = Array.from(document.querySelectorAll("h1.article-title"), item => item.textContent);
        let text = Array.from(document.querySelectorAll("div.article-content p"), item => item.textContent);
        let content = {
            "title":    title,
            "text":     text,
        };
        return content;
    });

    content.text = filterText(content.text);
    printContent(content);

    await browser.close();
}

// ===== Call main functions =====
// scrapeWebsite("https://venturebeat.com/2022/07/07/red-dead-online-scales-back-support/");
scrapeWebsite("https://www.gamedeveloper.com/culture/more-developers-are-pushing-back-against-player-toxicity");

