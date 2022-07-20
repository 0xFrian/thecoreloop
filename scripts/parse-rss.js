const Parser = require("rss-parser");
const parser = new Parser();

/**
    * Parses through given string for relevant HTML attributes of an <img> tag. 
    * Searches for width, height, and src.
    *
    * @param   {string}  contentEncoded : String representing the raw <img> tag with
    *                                      all its attributes
    * @return  {object}  imageData      : Object containing HTMl attributes for 
    *                                      an <img> tag
    */
function parseContentEncoded(contentEncoded) {
    // Search for width attribute
    let widthIndex_start = contentEncoded.search("width") + 7;
    let widthIndex_end = contentEncoded.substring(widthIndex_start).search('"');
    let width = contentEncoded.substring(widthIndex_start, widthIndex_start+widthIndex_end);

    // Search for height attribute
    let heightIndex_start = contentEncoded.search("height") + 8;
    let heightIndex_end = contentEncoded.substring(widthIndex_start).search('"');
    let height = contentEncoded.substring(heightIndex_start, heightIndex_start+heightIndex_end);

    // Search for src attribute
    let srcIndex_start = contentEncoded.search("https://");
    let srcIndex_end = contentEncoded.substring(srcIndex_start).search('"'); 
    let src = contentEncoded.substring(srcIndex_start, srcIndex_start+srcIndex_end);

    let imageData = {
        width   : width,
        height  : height,
        src     : src,
    };
    return imageData;
}

/** 
    * Searches through RSS feed for article(s) containing the given title 
    *
    * @param   {array}   data      : Array containing contents of RSS feed
    * @param   {string}  searchKey : Title to search for
    * @return  {array}   articles  : Array of articles whose title contain <searchKey>
    */
function findArticle(data, searchKey) {
    try {
        let articles = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i]
            let title = item.title;
            if (title.includes(searchKey)) {
                articles.push(item);
            }
        } 
        if (articles.length == 0) {
            throw `  ❌ Error: no articles with "${searchStr}"`;
        }
        console.log(`  ✅ Success: ${articles.length} article(s) found with "${searchKey}" \n`);
        return articles;
    }
    catch (error) {
        console.log(error + "\n");
    }
}

/**
    * Parses an RSS feed and extracts relevant information such as:
    *  title, author, date, content, image source, and link (URL to web page)
    *
    * @param   {object}  feed : Object containing contents of RSS feed
    * @return  {array}   data : Array containing contents of RSS feed, after
    *                                 filtering out irrelevant content
    */
function parseFeed(feed) {
    let data_raw = feed.items;
    let data = [];
    for (let i = 0; i < data_raw.length; i++) {
        let item_raw = data_raw[i];
        let item = {
            title:          item_raw.title,
            author:         item_raw.creator,
            date:           item_raw.pubDate,
            content:        item_raw.contentSnippet,
            contentEncoded: item_raw["content:encoded"],
            image:          parseContentEncoded(item_raw["content:encoded"]),
            link:           item_raw.link,
        };
        data.push(item);
    }
    return data;
}

/**
    * Fetches the RSS feed given its link or website URL (e.g. "https://website.xyz")
    *
    * @param   {string}  webURL : String representing URL to RSS feed
    * @return  {object}  feed   : Object containing contents of RSS feed
    */
async function fetchFeed(webURL) {
    let feed = await parser.parseURL(webURL);
    return feed;
}

module.exports = {
    fetchFeed,
    parseFeed,
    findArticle,
}

