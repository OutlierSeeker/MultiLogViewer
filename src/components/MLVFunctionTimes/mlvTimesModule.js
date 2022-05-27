/* TODO add 'LogEntries' with [ 1, 2, 1, 3, ...] for function times */

const path = require('path');
const fs = require('fs');
const readline = require('readline');
// const settings = require('../../js/settings');

let updateUIevery = 10;
let settings;
let currentWindow;

class FunctionTimeData {
    constructor(filename) {
        this.filename = filename;
        this.readRows = 0;
        this.invalidRows = 0;
        this.finishedReading = false;
        this.data = [];
        // console.log('TestModule: TR: created new TestResults:', this);

    }
}

let validColumnFields = [
    'Function',
    '#Called',
    'TotalTime',
    'OverallMin',
    'OverallAverage',
    'OverallMax',
    'FirstMin', /* 6 */
    'FirstAverage',
    'FirstMax',
    'LastMin',
    'LastAverage',
    'LastMax',
    'Comment', /* 12 */
    // 'Sequence', 
];


exports.functionTimes = {};
exports.columnMap = [];
let readFirstLine = false;

const resetTestData = (filename) => {
    this.functionTimes = new FunctionTimeData(filename);
    this.columnMap = [];
    readFirstLine = false;
};

const parseStringToNano = (nString) => {
    let n = 0;
    if (nString.indexOf('.') > -1) {
        n = Math.round(Number(nString) * 1000000000);
    }
    else {
        n = Number(nString);
    }
    return n;
}

const parseLineArray = (lineArray) => {
    // console.log("TimesMod: parseLine: parsing:", lineArray[0]);
    // console.log("TimesMod: parseLine: data.l:", this.functionTimes.data.length);
    // console.log("TimesMod: parseLine: lineArray.l:", lineArray.length, " - columnMap.l:", this.columnMap.length);
    if (lineArray.length < this.columnMap.length) {
        console.log(`columnMap.l: ${this.columnMap.length} - ignoring this line ${lineArray.length}:`, lineArray.join());
        this.functionTimes.invalidRows++;
    }
    else {
        let entry = {};
        let validRow = true;
        for (let i = 0; i < this.columnMap.length; i++) {
            switch (this.columnMap[i]) {
                case 0: /* Function */
                    entry.functionName = lineArray[i];
                    // row.time = parseDate(lineArray[i]);  // TODO implement this
                    break;
                case 1: /* #Called */
                    entry.nCalled = Number(lineArray[i]);
                    if (isNaN(entry.nCalled)) {
                        validRow = false;
                    }
                    break;
                case 2: /* TotalTime */
                    entry.totalTime = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.totalTime)) {
                        validRow = false;
                    }
                    break;
                case 3: /* OverallMin */
                    entry.overallMin = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.overallMin)) {
                        validRow = false;
                    }
                    break;
                case 4: /* OverallAverage */
                    entry.overallAverage = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.overallAverage)) {
                        validRow = false;
                    }
                    break;
                case 5: /* OverallMax */
                    entry.overallMax = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.overallMax)) {
                        validRow = false;
                    }
                    break;
                case 6: /* FirstMin */
                    entry.firstMin = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.firstMin)) {
                        validRow = false;
                    }
                    break;
                case 7: /* FirstAverage */
                    entry.firstAverage = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.firstAverage)) {
                        validRow = false;
                    }
                    break;
                case 8: /* FirstMax */
                    entry.firstMax = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.firstMax)) {
                        validRow = false;
                    }
                    break;
                case 9: /* LastMin */
                    entry.lastMin = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.lastMin)) {
                        validRow = false;
                    }
                    break;
                case 10: /* LastAverage */
                    entry.lastAverage = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.lastAverage)) {
                        validRow = false;
                    }
                    break;
                case 11: /* LastMax */
                    entry.lastMax = parseStringToNano(lineArray[i]);
                    if (isNaN(entry.lastMax)) {
                        validRow = false;
                    }
                    break;
                case 12: /* Comment */
                    entry.comment = lineArray[i];
                    break;

                default:
                    break;
            }
        }
        if (validRow) {
            // console.log("TimesMod: parseLine: adding entry:", entry.functionName);
            this.functionTimes.data.push(entry);
        }
        else { this.functionTimes.invalidRows++; }
    }
};


const parseLine = async (line) => {
    if (line.charAt(0) != '#') {
        let rar = line.split(settings.General.tableSeparator);
        let validColumnAssignments = true;
        let foundRightField;
        if (!readFirstLine) {
            readFirstLine = true;
            for (let col = 0; col < rar.length; col++) {
                foundRightField = false;
                if (validColumnAssignments) {
                    for (let fi = 0; fi < validColumnFields.length; fi++) {
                        if (rar[col] == validColumnFields[fi]) {
                            this.columnMap.push(fi);
                            foundRightField = true;
                            break;
                        }
                    }
                    if (!foundRightField) {
                        validColumnAssignments = false;
                        // console.log('functionTimesModule: parseLine: did not find header:', rar[col]);
                    }
                }
            }
            if (!validColumnAssignments) {
                this.columnMap = [];
                for (let i = 0; i < validColumnFields.length; i++) {
                    this.columnMap.push(i);
                }

                parseLineArray(rar);
            }
            // console.log('Set columns to:', this.columnMap);
        }
        else {
            parseLineArray(rar);
        }
    }
};


exports.loadMLVTimesFile = async (window, filepath, filename, allSettings) => {
    // console.log("TimesModule: loadFile(): filename: ", filename, 'lineSeparator: ', allSettings.General.tableSeparator);
    settings = allSettings;
    currentWindow = window;
    resetTestData(filename);
    // console.log('loadMLVTimesFile: functionTimes:', this.functionTimes);
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(filepath, filename)),
        crlfDelay: Infinity
    });

    readFirstLine = false;
    rl.
        on('line', (line) => {
            this.functionTimes.readRows++;
            parseLine(line);
            // if (this.functionTimes.readRows % updateUIevery === 0) {
            //     console.log("Flushing Time data");
            // }
        })
        .on('close', () => {
            // console.log("ended reading time file");
            this.functionTimes.finishedReading = true;
            // console.log("TimesModule: loadFile: ", this.functionTimes);
        });
};
