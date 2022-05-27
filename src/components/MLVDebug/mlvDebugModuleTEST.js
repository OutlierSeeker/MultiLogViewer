const utilities = require('../../js/utilities');
// const settings = require('../../js/settings');

// console.log("Initializing TEST debug data...");

let settings;
let updateUIevery = 10;
let currentDebugWindow; /* TODO window is not needed anymore? */

exports.filename = 'test.log';
exports.finishedReading = false;
exports.readRows = 0;
exports.invalidRows = 0;
exports.columnMap = [];
exports.sortedLevelCounts = [];
exports.levelCount = [];
exports.classCount = [];
exports.functionCount = [];
exports.parsedRows = [];

let allParsedRows = [];

const resetDebugData = (filename) => {
    // console.log("resetting TEST debug data");
    this.filename = filename;
    this.finishedReading = false;
    this.readRows = 0;
    this.invalidRows = 0;
    this.columnMap = [];
    this.sortedLevelCounts = [];
    for (let i = 0; i < debugLevel.length; i++) {
        this.sortedLevelCounts.push(i);
    }
    this.levelCount = [];
    this.classCount = [];
    this.functionCount = [];
    this.parsedRows = [];
    allParsedRows = [];
};

exports.getNewDebugData = () => {
    let oldNewRows;
    /* TODO change when in production */
    if (this.finishedReading && (this.readRows > 0) && (this.parsedRows.length === 0)) {
        oldNewRows = allParsedRows;
    }
    else {
        oldNewRows = this.parsedRows;
        this.parsedRows = [];
    } /* end of def */
    return {
        dFilename: this.filename,
        dFinishedReading: this.finishedReading,
        dReadRows: this.readRows,
        dInvalidRows: this.invalidRows,
        dSortedLevelCounts: this.sortedLevelCounts,
        dLevelCount: this.levelCount,
        dClassCount: this.classCount,
        dFunctionCount: this.functionCount,
        dParsedRows: oldNewRows,
    };
}

let debugLevel = [
    { level: 'TRACE', colorLight: '#ffffff', backgroundColorLight: '#0000ff', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // blue
    { level: 'INFO', colorLight: '#000000', backgroundColorLight: '#FF4DE7', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },   // purple
    { level: 'DEBUG', colorLight: '#000000', backgroundColorLight: '#55F7DC', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // cyan
    { level: 'PASS', colorLight: '#000000', backgroundColorLight: '#25E817', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // green
    { level: 'WARNING', colorLight: '#000000', backgroundColorLight: '#ffff00', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', }, // yellow
    { level: 'ERROR', colorLight: '#000000', backgroundColorLight: '#FF8822', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // orange
    { level: 'FATAL', colorLight: '#ffffff', backgroundColorLight: '#ff0000', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', }, // red
    { level: 'UNKNOWN', colorLight: '#000000', backgroundColorLight: '#fafafa', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', }, // gray
];

const getSortedDebugLevelIndex = (levelname) => {
    // console.log("starting getSortedDebugLevelIndex");
    let foundLevel = false;
    for (let i = 0; i < (debugLevel.length - 1); i++) {
        foundLevel = false;
        // console.log(`comparing ${levelname} with ${debugLevel[i].level}`);
        if (levelname.toUpperCase() === debugLevel[i].level) {
            // console.log("found getSortedDebugLevelIndex", i);
            return i;
        }
    }

    // console.log("using getSortedDebugLevelIndex", debugLevel.length - 1);
    return (debugLevel.length - 1);
};

const isStandardDebugLevel = (name) => {
    for (let i = 0; i < debugLevel.length; i++) {
        // console.log(name.toUpperCase(), " issdl ", this.debugLevel[i].level);
        if ((name.toUpperCase() == debugLevel[i].level)) { return true; }
    }
    return false;
};
// exports.getDebugLevel = (index) => {
//     // console.log("index:", index, "mdl:", mdl[index]);
//     return debugLevel[index].level;
// }
// exports.getDebugLevelColor = (index) => {
//     return debugLevel[index].color;
// }
// exports.getDebugLevelBackgroundColor = (index) => {
//     return debugLevel[index].backgroundColor;
// }

const addLevel = (addname) => {
    this.sortedLevelCounts[getSortedDebugLevelIndex(addname)]++;
    // console.log(`addLevel(${addname}): isStandardDL:`, settings.isStandardDebugLevel(addname));

    // console.log(`addLevel(${addname}):${this.mlvDebugSummary.levelCount.level}`);
    let index = this.levelCount.findIndex((obj => { return obj.level == addname.toUpperCase(); }));
    if (index === -1) {
        if (isStandardDebugLevel(addname)) {
            this.levelCount.push({ level: addname.toUpperCase(), count: 1 });
        }
        else {
            let unkIndex = this.levelCount.findIndex((obj => { return obj.level == 'UNKNOWN'; }));
            if (unkIndex === -1) { this.levelCount.push({ level: 'UNKNOWN', count: 1 }); }
            else { this.levelCount[unkIndex].count++; }
        }
    }
    else {
        this.levelCount[index].count++;
    }
};
const addClass = (addname) => {
    let index = this.classCount.findIndex((obj => { return obj.name == addname }));
    if (index === -1) {
        this.classCount.push({ name: addname, count: 1 });
    }
    else {
        this.classCount[index].count++;
    }
};
const addFunction = (addname) => {
    let index = this.functionCount.findIndex((obj => { return obj.name == addname }));
    if (index === -1) {
        this.functionCount.push({ name: addname, count: 1 });
    }
    else {
        this.functionCount[index].count++;
    }
};

let debugs = ["debug", "info", "warning", "trace", "error", "fatal", "test", "pass"];
let classes = ["Test", "Log", "MyClass", "Foo", "Bar"];
let funcs = ["func1", "func2", "func3", "myOtherfunc", "getGoal", "whatsafunc", "setGoal"];
let comment = [
    "This is a comment",
    "Another comment",
    "Hi there",
    "Whazzzuup",
    "I've scored a goal!",
    "No who's the other guy?"
];
function makeRow(extraComment) {
    let obj = {};
    obj.debugTime = extraComment;
    obj.debugLevel = debugs[Math.floor(Math.random() * debugs.length)];
    obj.debugClass = classes[Math.floor(Math.random() * classes.length)];
    obj.debugFunction = funcs[Math.floor(Math.random() * funcs.length)];
    obj.debugComment =
    extraComment + ": " + comment[Math.floor(Math.random() * comment.length)];
    
    addLevel(obj.debugLevel);
    addClass(obj.debugClass);
    addFunction(obj.debugFunction);

    // console.log("created", obj);
    return obj;
}


exports.loadMLVDebugFile = async (window, filepath, filename, allSettings) => {
    currentDebugWindow = window;
    settings = allSettings;
    resetDebugData(filename);

    let max = 62;
    for (let i = 0; i < max; i++) {
        await utilities.delay(100);
        // console.log("creating TEST row", i);
        /* TODO remove for production...for debugging..or is it? */
        // this.parsedRows.push(makeRow(i));
        let crow = makeRow(i);
        this.parsedRows.push(crow);
        allParsedRows.push(crow);
        this.readRows++;
        if (i === (max - 1)) {
            console.log("done creating test rows");
            this.finishedReading = true;
        }
    }
}