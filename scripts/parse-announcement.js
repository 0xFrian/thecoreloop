const fs = require("fs");

// thecoreloop general key phrases
const DICT_TCL = {
    "title"     : [ "A Look at Games #" ],
    "category"   : [
        "🔦 Spotlight 🌟",
        "💰 Fundraising 🧧",
        "👾 Game Releases 🎮",
        "🧠 Knowledge Hub 📚",
        "🌊 MARKET ☎️",
        "🌈 Platforms 🏔",
        "💎 Storytime 🔎",
        "✨ Web 3️⃣ + Meta 🌎",
    ],
    "link"      : [ "https://" ],
}

// Date-related key phrases
const DICT_DATE = {
    "day"       : [ 
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday" 
    ],
    "month"     : [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],
    "year"      : [
        "2022"
    ],
};

/**
    * Determines if given line represents a day (e.g. "Wednesday")
    *
    * @param   {string}   line : Line from announcement
    * @return  {boolean}       : True if <line> represents a day, else False
    */
function isDay(line) {
    for (let i = 0; i < Object.keys(DICT_DATE["day"]).length; i++) {
        let keyPhrase = DICT_DATE["day"][i];
        if (line.includes(keyPhrase) && line.split(" ").length == 1) {
            // Check if <line> contains day and conists only of 1 word
            return true;
        }
    }
    return false;
}

/** * Determines if given line represents a date (e.g. "July 13th 2022")
    * 
    * @param   {string}   line : Line from announcement 
    * @return  {boolean}       : True if <line> represents a date, else False
    */
function isDate(line) {
    // Look for a month
    let monthFound = false;
    for (let i = 0; i < Object.keys(DICT_DATE["month"]).length; i++) {
        let keyPhrase = DICT_DATE["month"][i];
        if (line.includes(keyPhrase)) {
            monthFound = true;
        }
    };
    // Look for a year
    let yearFound = false
    for (let j = 0; j < Object.keys(DICT_DATE["year"]).length; j++) {
        let keyPhrase = DICT_DATE["year"][j];
        if (line.includes(keyPhrase)) {
            yearFound = true;
        }
    }

    if (monthFound && yearFound && line.split(" ").length == 3) {
        // Check if line contains month and year, and consists only of 3 words
        return true;
    }
    return false;
}

/** 
    * Determines if given line represents a title (e.g. "A Look at Games #9️⃣")
    *
    * @param   {string}   line : Line from announcement 
    * @return  {boolean}       : True if <line> represents a title, else False
    */
function isTitle(line) {
    for (let i = 0; i < Object.keys(DICT_TCL["title"]).length; i++) {
        let keyPhrase = DICT_TCL["title"][i];
        if (line.includes(keyPhrase)) {
            return true
        } 
    }
    return false;
}

/** 
    * Determines if given line represents a category (e.g. "🌊 MARKET ☎️")
    *
    * @param   {string}   line : Line from announcement 
    * @return  {boolean}       : True if <line> represents a category, else False
    */
function isCategory(line) {
    for (let i = 0; i < Object.keys(DICT_TCL["category"]).length; i++) {
        let keyPhrase = DICT_TCL["category"][i];
        if (line.includes(keyPhrase)) {
            return true;
        }
    }
    return false;
}

/**
    * Determines if given line represents a link or website URL (e.g. https:website.xyz) 
    *
    * @param   {string}   line : Line from annnouncement
    * @return  {boolean}       : True if <line> represent a link, else False
    */
function isLink(line) {
    for (let i = 0; i < Object.keys(DICT_TCL["link"]).length; i++) {
        let keyPhrase = DICT_TCL["link"][i];
        if (line.includes(keyPhrase)) {
            return true;
        }
    }
    return false;
}

/**
    * Determines what type of content a line contains (e.g. 🌊 MARKET ☎️  --> "category")
    *
    * @param   {string}  line  : Line from announcement 
    * @return  {string}        : String representing type of content 
    */
function identifyContent(line) {
    if (isDay(line)) {
        return "day"; 
    } else if (isDate(line)) {
        return "date";
    } else if (isTitle(line)) {
        return "title";
    } else if (isCategory(line)) {
        return "category";
    } else if (isLink(line)) {
        return "link";
    } else {
        // If no key phrases found, then assume "caption" 
        return "caption";
    }
}

/**
    * Reads a Markdown file containing an annnouncement
    *
    * @param   {string}  filePath : File path of Markdown file
    * @return  {array}   data     : String array with each element representing 
    *                                  a line in the text file
    */
function readAnnouncement(filePath) {
    try {
        let data_raw = fs.readFileSync(filePath, { encoding: "utf8" });
        let data = data_raw
                    .split("\n")                        // Separate line-by-line
                    .filter(item => item.length > 0)    // Remove emtpy lines
                    .map(item => item.trim());          // Remove surrounding whitespaces
        return data;
    } catch (err) {
        console.log("   Error:", err);
    }
}

/** 
    * Parses through an announcement, organizing its contents neatly into 
    *  a JSON object for better visbility and later reference
    *
    * @param   {array}   data         : array containing contents of announcement
    * @return  {object}  announcement : JSON object containing contents of announcement 
    */
function parseAnnouncement(data) {
    let announcement = {};      
    // Look at announcement-json-structure.md to see how contents are organized

    let content = [];           // array of <categoryGroup> objects
    let categoryGroup = {};     // JSON object containing a category and array of articles

    let articles = [];          // array of <article> objects
    let article = {};           // JSON object representing an article with a caption 
                                //  and link (URL to the web page)

    let category = "";          // string representing current category being parsed
    let nextCategory = false;   // true if current line marks beginning of next category
    let lastCategory = false;   // true if current line marks end of file, and thus last category

    for (let i = 0; i < data.length; i++) {
        let line = data[i];                      // current line of announcement
        let lineContent = identifyContent(line);    // type of content <line> represents

        if (lineContent == "title" && !announcement.hasOwnProperty("title")) {
            announcement.title = line;
        } else if (lineContent == "day" && !announcement.hasOwnProperty("day")) {
            announcement.day = line;
        } else if (lineContent == "date" && !announcement.hasOwnProperty("date")) {
            announcement.date = line;
        } else {
            if (lineContent == "category") {
                if (!categoryGroup.hasOwnProperty("category")) {
                    categoryGroup.category = line;
                } else {
                    // If <category> already assigned, then move onto next category
                    nextCategory = true;
                }
            } else if (lineContent == "caption") {
                article.caption = line;
            } else if (lineContent == "link") {
                article.link = line;
            } 
            if (article.hasOwnProperty("caption") && article.hasOwnProperty("link")) {
                // If <article.caption> and <article.link> already assigned, then 
                //  append to <articles>
                articles.push(article)
                article = {};
            }
            if (i == data.length-1) {
                lastCategory = true;
            }
            if (nextCategory || lastCategory) {
                // Check if it's time to add current <categoryGroup> to <content>, 
                //  which means either: 
                //  (1) Next category detected
                //  (2) Last category detected
                
                // Add current <categoryGroup> to <content>
                categoryGroup.articles = articles;         
                content.push(categoryGroup);         

                if(nextCategory) {
                    // If there is a next category, then reset variables and assign new category
                    nextCategory = false;
                    categoryGroup = {};
                    articles = [];
                    categoryGroup.category = line;
                }
            }
        }
    }
    announcement.content = content;
    return announcement;
}

module.exports = {
    readAnnouncement,
    parseAnnouncement,
}

