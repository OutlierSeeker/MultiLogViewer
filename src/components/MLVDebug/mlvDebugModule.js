const path = require('path');
const fs = require('fs');
const readline = require('readline');
// const settings = require('../../js/settings');
// const { mlvDebugSummary } = require('../../js/modules');

let settings;
let updateUIevery = 10;
let currentDebugWindow; /* TODO window is not needed anymore? */
let validColumnFields = ['Time', 'Level', 'Class', 'Function', 'Comment'];

// console.log("Initializing debug data...");
exports.filename = 'unreal.log';
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
    // console.log("resetting debug data");
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

// exports.getNewDebugData = () => {
//     let oldNewRows = this.parsedRows;
//     // this.parsedRows = [];    /* TODO change when in production */
//     return {
//         dFilename: this.filename,
//         dFinishedReading: this.finishedReading,
//         dReadRows: this.readRows,
//         dInvalidRows: this.invalidRows,
//         dSortedLevelCounts: this.sortedLevelCounts,
//         dLevelCount: this.levelCount,
//         dClassCount: this.classCount,
//         dFunctionCount: this.functionCount,
//         dParsedRows: oldNewRows,
//     };
// }

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

/** adds the rows level to an array, assumes 'UNKNOWN' as last entry */
// const addSortedLevel = (levelname) => {
// console.log("addSortedLevel:", levelname);
// let foundLevel = false;
// for (let i = 0; i < (settings.mlvDebugLevels.length - 1); i++) {
//     foundLevel = false;
//     // console.log(`comparing ${levelname} with ${settings.mlvDebugLevels[i].level}`);
//     if (levelname.toUpperCase() === settings.mlvDebugLevels[i].level) {
//         this.sortedLevelCounts[i]++;
//         foundLevel = true;
//         break;
//     }
// }
// if (!foundLevel) { this.sortedLevelCounts[this.sortedLevelCounts.length - 1]++; }
// console.log("settings.getDebugLevelIndex(levelname):", settings.getDebugLevelIndex(levelname), 'count:', this.sortedLevelCounts[settings.getDebugLevelIndex(levelname)]);
//     this.sortedLevelCounts[settings.getDebugLevelIndex(levelname)]++;
// };

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

// const addLevel = (addname) => {
//     this.sortedLevelCounts[settings.getDebugLevelIndex(addname)]++;
//     // console.log(`addLevel(${addname}): isStandardDL:`, settings.isStandardDebugLevel(addname));

//     // console.log(`addLevel(${addname}):${this.mlvDebugSummary.levelCount.level}`);
//     let index = this.levelCount.findIndex((obj => { return obj.level == addname.toUpperCase(); }));
//     if (index === -1) {
//         if (settings.isStandardDebugLevel(addname)) {
//             this.levelCount.push({ level: addname.toUpperCase(), count: 1 });
//         }
//         else {
//             let unkIndex = this.levelCount.findIndex((obj => { return obj.level == 'UNKNOWN'; }));
//             if (unkIndex === -1) { this.levelCount.push({ level: 'UNKNOWN', count: 1 }); }
//             else { this.levelCount[unkIndex].count++; }
//         }
//     }
//     else {
//         this.levelCount[index].count++;
//     }
// };
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

// exports.mlvDebugRows = {};

const parseDate = (input) => {
    //TODO implement date parsing
    return input;
}

// let colMap = [];
// let debugRows = [];
const parseLineArray = (lineArray) => {
    if (lineArray.length < this.columnMap.length) {
        // console.log(`colMap.l: ${colMap.length} - ignoring this line ${lineArray.length}:`, lineArray.join());
        this.invalidRows++;
    }
    else {
        let row = {};
        for (let i = 0; i < this.columnMap.length; i++) {
            switch (this.columnMap[i]) {
                case 0:
                    row.debugTime = lineArray[i];
                    // row.time = parseDate(lineArray[i]);  // TODO implement this
                    break;
                case 1:
                    row.debugLevel = lineArray[i];
                    addLevel(row.debugLevel);
                    // addSortedLevel(row.debugLevel);
                    break;
                case 2:
                    row.debugClass = lineArray[i];
                    addClass(row.debugClass);
                    break;
                case 3:
                    row.debugFunction = lineArray[i];
                    addFunction(row.debugFunction);
                    break;
                case 4:
                    row.debugComment = lineArray[i];
                    break;
                default:
                    break;
            }
        }
        // console.log("Added line:", row);
        this.parsedRows.push(row);
        allParsedRows.push(row);
    }
};

let readFirstLine = false;
const parseLine = async (line) => {
    // await utilities.delay(1000);
    if (line.charAt(0) != '#') {
        let rar = line.split(settings.General.tableSeparator);
        let validColumnAssignments = true;
        let foundRightField;
        if (!readFirstLine) {
            readFirstLine = true;
            // console.log("reading first line:", rar);
            for (let col = 0; col < rar.length; col++) {
                foundRightField = false;
                if (validColumnAssignments) {
                    for (let fi = 0; fi < validColumnFields.length; fi++) {
                        // console.log("comparing", rar[col], " and ", validColumnFields[fi]);
                        if (rar[col] == validColumnFields[fi]) {
                            this.columnMap.push(fi);
                            foundRightField = true;
                            break;
                        }
                    }
                    if (!foundRightField) { validColumnAssignments = false; }
                }
            }
            // console.log("colMap:", colMap, "validColAss:", validColumnAssignments);
            if (!validColumnAssignments) {
                this.columnMap = [];
                for (let i = 0; i < validColumnFields.length; i++) {
                    this.columnMap.push(i);
                }

                parseLineArray(rar);
            }
            // currentWindow.webContents.send("initializeDebug", { idFilename: this.filename, idColumnMap: this.columnMap });
        }
        else {
            parseLineArray(rar);
        }
        // console.log("row:", line, "\t[0]:", rar[0]);
    }

    // console.log(`Line from file: ${line}, levelCount.l: ${this.levelCount.length}, fn: ${this.filename}`);
    // console.log(this.mlvDebugSummary);
};

// const loadFile = async (filepath, filename) => {
//     const rl = readline.createInterface({
//         input: fs.createReadStream(path.join(filepath, filename)),
//         crlfDelay: Infinity
//     });

//     rl.on('line', (line) => { parseLineToObject(line) });
// }

exports.loadMLVDebugFile = async (window, filepath, filename, allSettings) => {
    currentDebugWindow = window;
    settings = allSettings;
    resetDebugData(filename);
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(filepath, filename)),
        crlfDelay: Infinity
    });

    readFirstLine = false;
    flushCounter = 0;
    rl.
        on('line', (line) => {
            this.readRows++;
            parseLine(line);
            if (this.readRows % updateUIevery === 0) {
                // console.log("Flushing Debug data");
                // currentWindow.webContents.send("ipcDebugSummary", this.mlvDebugSummary);
                // currentWindow.webContents.send("ipcDebugSummary", this.filename);  // BUG CHANGE THIS TO UPDATE DATA
                // this.mlvDebugSummary.readRows = 0;
            }
        })
        .on('close', () => {
            // console.log("ended reading file");
            this.finishedReading = true;
            // currentWindow.webContents.send("ipcDebugSummary", this.mlvDebugSummary);
            // currentWindow.webContents.send("ipcDebugSummary", this.filename);  // BUG CHANGE THIS TO UPDATE DATA
        });
};
