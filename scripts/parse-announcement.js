const fs = require("fs");

// JSON object containing key phrases for labelling contents of an announcement
const DICTIONARY_GENERAL = {
    "title"     : [ "A Look at Games #" ],
    "subject"   : [
        "🔦 Spotlight 🌟",
        "💰 Fundraising 🧧",
        "👾 Game Releases 🎮",
        "🧠 Knowledge Hub 📚",
        "🌊 MARKET ☎️",
        "🌈 Platforms 🏔",
        "💎 Storytime 🔎",
        "✨ Web 3️⃣ + Meta 🌎",
    ],
    "link"      : [ "https" ],
}

// JSON object containing key phrases for date-related content (days, months, year)
const DICTIONARY_DATE = {
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
    * Returns contents of given file, applying some filtering criteria: split("\n"), trim(), and non-zero length
    *
    * @param {string} filePath      : File path of file to be read in
    * @return {array} dataArr_filt  : String array containing contents of the given file
    */
function readAnnouncement(filePath) {
    try {
        let dataStr_raw = fs.readFileSync(filePath, { encoding: "utf8" });
        let dataArr_filt = dataStr_raw
                            .split("\n")                        // Separate line-by-line
                            .filter(item => item.length > 0)    // Remove emtpy lines
                            .map(item => item.trim());          // Remove surrounding whitespaces
        return dataArr_filt;
    } catch (err) {
        console.log("   Error:", err);
    }
}

/**
    * Returns boolean if given segment represents a day of the week 
    *
    * @param {string} segment   : line from announcement 
    * @return {boolean}         : true if given segment represents a day of the week, else false
    */
function isDay(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_DATE["day"]).length; i++) {
        let keyPhrase = DICTIONARY_DATE["day"][i];
        if (segment.includes(keyPhrase) && segment.split(" ").length == 1) {
            // Check if segment includes keyPHrase and consists of only 1 word
            return true;
        }
    }
    return false;
}

/** * Returns boolean if given segment represents a date (e.g. July 15th 2022)
    * 
    * @param {string} segment   : line from announcement 
    * @return {boolean}         : true if given segment represents a date, else false
    */
function isDate(segment) {
    // Look for a month
    let monthFound = false;
    for (let i = 0; i < Object.keys(DICTIONARY_DATE["month"]).length; i++) {
        let keyPhrase = DICTIONARY_DATE["month"][i];
        if (segment.includes(keyPhrase)) {
            monthFound = true;
        }
    };
    // Look for a year
    let yearFound = false
    for (let j = 0; j < Object.keys(DICTIONARY_DATE["year"]).length; j++) {
        let keyPhrase = DICTIONARY_DATE["year"][j];
        if (segment.includes(keyPhrase)) {
            yearFound = true;
        }
    }

    if (monthFound && yearFound && segment.split(" ").length == 3) {
        // Check if segment contains month and year, and consists only of 3 words
        return true;
    }
    return false;
}

/** 
    * Returns true if given segment represents a title (e.g. A Look at Games #9️⃣)
    *
    * @param {string} segment   : line from announcement 
    * @return {boolean}         : true if given segment represents a title, else false
    */
function isTitle(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_GENERAL["title"]).length; i++) {
        let keyPhrase = DICTIONARY_GENERAL["title"][i];
        if (segment.includes(keyPhrase)) {
            return true
        } 
    }
    return false;
}

/** 
    * Returns true if given segment represents a subject (e.g. 🌊 MARKET ☎️)h
    *
    * @param {string} segment   : line from announcement 
    * @return {boolean}         : true if given segment represents a subject, else false
    */
function isSubject(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_GENERAL["subject"]).length; i++) {
        let keyPhrase = DICTIONARY_GENERAL["subject"][i];
        if (segment.includes(keyPhrase)) {
            return true;
        }
    }
    return false;
}

/**
    * Returns true if given segment represents a link (e.g. https:website.xyz) 
    *
    * @param {string} segment   : line from annnouncement
    * @return {boolean}         : true if given segment represent a link, else false
    */
function isLink(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_GENERAL["link"]).length; i++) {
        let keyPhrase = DICTIONARY_GENERAL["link"][i];
        if (segment.includes(keyPhrase)) {
            return true;
        }
    }
    return false;
}

/**
    * Returns a label for the given segment (e.g. 🌊 MARKET ☎️  would return "subject") 
    *
    * @param {string} segment   : line from announcement 
    * @return {string}          : label for the given segment 
    */
function labelSegment(segment) {
    if (isDay(segment)) {
        return "day"; 
    } else if (isDate(segment)) {
        return "date";
    } else if (isTitle(segment)) {
        return "title";
    } else if (isSubject(segment)) {
        return "subject";
    } else if (isLink(segment)) {
        return "link";
    } else {
        // If no labels have been found, then assume "caption" 
        return "caption";
    }
}

/** 
    * Parses through announcement, organizing its contents neatly into a JSON object for better visbility and later reference
    *
    * @param {array} dataArr            : array containing the contents of the announcement
    * @return {object} announcement     : JSON object containing contents of announcement 
    */
function parseAnnouncement(dataArr) {
    let announcement = {};
    let content = [];
    let contentEntry = {};
    let items = []; 
    let itemEntry = {};
    let subject = "";
    let nextSubject = false;
    let lastSubject = false;

    for (let i = 0; i < dataArr.length; i++) {
        let segment = dataArr[i];
        let label = labelSegment(segment);
        if (label == "title" && !announcement.hasOwnProperty("title")) {
            // Check if there's only one "title" label
            announcement.title = segment;
        } else if (label == "day" && !announcement.hasOwnProperty("day")) {
            // Check if there's only one "day" label
            announcement.day = segment;
        } else if (label == "date" && !announcement.hasOwnProperty("date")) {
            // Check if there's only one "date" label
            announcement.date = segment;
        } else {
            if (label == "subject") {
                if (!contentEntry.hasOwnProperty("subject")) {
                    // If subject property hasn't been assigned yet, then assign it
                    contentEntry.subject = segment;
                } else {
                    // If subject property has already been assigned, then add current subject and move onto the next subject
                    nextSubject = true;
                }
            } else if (label == "caption") {
                itemEntry.caption = segment;
            } else if (label == "link") {
                itemEntry.link = segment;
            } 
            if (itemEntry.hasOwnProperty("caption") && itemEntry.hasOwnProperty("link")) {
                // If caption and link properties have been added, then append to list of items 
                items.push(itemEntry)
                itemEntry = {};
            }
            if (i == dataArr.length-1) {
                lastSubject = true;
            }
            if (nextSubject || lastSubject) {
                // Check if it's time to add the current subject to content array, which means either:
                //  (1) Next subject detected
                //  (2) Last subject detected
                //  
                // Add current subject to content array 
                contentEntry.items = items;         
                content.push(contentEntry);         
                // Reset variables
                nextSubject = false;                
                contentEntry = {};
                items = [];
                // Assign new subject
                contentEntry.subject = segment;
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

