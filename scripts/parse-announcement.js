const fs = require("fs");

const DICTIONARY = {
    "title"     : [ "A Look at Games" ],
    "subject"   : [
        "🔦 Spotlight 🌟",
        "💰 Fundraising 🧧",
        "🧠 Knowledge Hub 📚",
        "🌊 MARKET ☎️",
        "🌈 Platforms 🏔",
        "💎 Storytime 🔎",
        "✨ Web 3️⃣ + Meta 🌎",
    ],
    "day"       : [ 
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday" 
    ],
    "date"      : [
        "2022"
    ],
    "link"      : [ "https" ],
}
const DICTIONARY_GENERAL = {
    "title"     : [ "A Look at Games" ],
    "subject"   : [
        "🔦 Spotlight 🌟",
        "💰 Fundraising 🧧",
        "🧠 Knowledge Hub 📚",
        "🌊 MARKET ☎️",
        "🌈 Platforms 🏔",
        "💎 Storytime 🔎",
        "✨ Web 3️⃣ + Meta 🌎",
    ],
    "link"      : [ "https" ],
}
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
    * @param {string} filePath : File path of file to be read in
    * @return {array} dataArr_filt : String array containing contents of the given file
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

function isDay(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_DATE["day"]).length; i++) {
        let keyPhrase = DICTIONARY_DATE["day"][i];
        if (segment.includes(keyPhrase) && segment.split(" ").length == 1) {
            return true;
        }
    }
    return false;
}

function isDate(segment) {
    let monthFound = false;
    for (let i = 0; i < Object.keys(DICTIONARY_DATE["month"]).length; i++) {
        let keyPhrase = DICTIONARY_DATE["month"][i];
        if (segment.includes(keyPhrase)) {
            monthFound = true;
        }
    };
    let yearFound = false
    for (let j = 0; j < Object.keys(DICTIONARY_DATE["year"]).length; j++) {
        let keyPhrase = DICTIONARY_DATE["year"][j];
        if (segment.includes(keyPhrase)) {
            yearFound = true;
        }
    }
    if (monthFound && yearFound && segment.split(" ").length == 3) {
        return true;
    }
    return false;
}

function isTitle(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_GENERAL["title"]).length; i++) {
        // Iterate through DICTIONARY_GENERAL["title"]
        let keyPhrase = DICTIONARY_GENERAL["title"][i];
        if (segment.includes(keyPhrase)) {
            return true
        } 
    }
    return false;
}

function isSubject(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_GENERAL["subject"]).length; i++) {
        let keyPhrase = DICTIONARY_GENERAL["subject"][i];
        if (segment.includes(keyPhrase)) {
            return true;
        }
    }
    return false;
}

function isLink(segment) {
    for (let i = 0; i < Object.keys(DICTIONARY_GENERAL["link"]).length; i++) {
        let keyPhrase = DICTIONARY_GENERAL["link"][i];
        if (segment.includes(keyPhrase)) {
            return true;
        }
    }
    return false;
}

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
        return "caption";
    }
}

function parseAnnouncement(dataArr) {
    let announcement = {};
    let content = [];
    let contentEntry = {};
    let items = [];
    let itemEntry = {};
    let registerSubject = false;
    for (let i = 0; i < dataArr.length; i++) {
        let segment = dataArr[i];
        let label = labelSegment(segment);
        if (label == "title" && !announcement.hasOwnProperty("title")) {
            announcement.title = segment;
        } else if (label == "day" && !announcement.hasOwnProperty("day")) {
            announcement.day = segment;
        } else if (label == "date" && !announcement.hasOwnProperty("date")) {
            announcement.date = segment;
        } else {
            if (label == "subject") {
                if (contentEntry.hasOwnProperty("subject")) {
                    registerSubject = true;
                } else {
                    contentEntry.subject = segment;
                }
            } else if (label == "caption") {
                itemEntry.caption = segment;
            } else if (label == "link") {
                itemEntry.link = segment;
            } 
            if (itemEntry.hasOwnProperty("caption") && itemEntry.hasOwnProperty("link")) {
                items.push(itemEntry)
                itemEntry = {};
            }
            if (registerSubject || i == dataArr.length-1) {
                registerSubject = false;
                contentEntry.items = items;
                content.push(contentEntry);
                contentEntry = {};
                contentEntry.subject = segment;
                items = [];
            }
        }
    }
    announcement.content = content;
    return announcement;
}

module.exports = {
    DICTIONARY, 
    readAnnouncement,
    parseAnnouncement,
}

