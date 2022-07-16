// Parsing RSS Feeds

// ===== Import packages =====
const Parser = require("rss-parser");
const parser = new Parser();

// ===== Helper function: parse through raw RSS data =====
function parseFeed (rawFeed) {
    let rawList = rawFeed.items;
    let filteredList = [];
    for (let i = 0; i < rawList.length; i++) {
        let item = rawList[i];
        let filteredItem = {
            title:      item.title,
            author:     item.creator,
            date:       item.pubDate,
            content:    item.contentSnippet,
            link:       item.link,
        };
        filteredList.push(filteredItem);
    }
    return filteredList;
}

// ===== Helper function: find article in RSS data using article title =====
function findArticle(filteredList, searchStr) {
    try {
        let foundArticles = [];
        for (let i = 0; i < filteredList.length; i++) {
            let itemTitle = filteredList[i].title;
            if (itemTitle.includes(searchStr)) {
                item = filteredList[i]; 
                foundArticles.push(item);
            }
        } 
        if (foundArticles.length == 0) {
            throw `  ❌ Error: no articles with "${searchStr}" \n`;
        }
        console.log(`  ✅ Success: ${foundArticles.length} article(s) found with "${searchStr}" \n`);
        console.log(foundArticles);
        return foundArticles;
    }
    catch (error) {
        console.log(error + "\n");
    }
}

// ===== Main function: use GamesBeat RSS =====
async function parseRSS(websiteURL) {
    let feed = await parser.parseURL(websiteURL);
    console.log(feed.items);
    let filteredList = parseFeed(feed);
    return filteredList;
}

module.exports = {
    parseRSS,
    parseFeed,
    findArticle,
}

