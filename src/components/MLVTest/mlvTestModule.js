const path = require('path');
const fs = require('fs');
const readline = require('readline');
// const settings = require('../../js/settings');

let updateUIevery = 10;
let settings;
let currentWindow;

class TestFunctionEntry {
    constructor(functionName) {
        this.nodeType = 'functionNode';
        this.nodeSuccess = true;
        this.nodeName = functionName;
        this.nodeEntries = [];
        this.nodeExpanded = false;
    }
}

class TestClassEntry {
    constructor(className) {
        this.nodeType = 'classNode';
        this.nodeSuccess = true;
        this.nodeName = className;
        this.nodeEntries = [];
        this.nodeExpanded = false;
    }
}

class TestResults {
    constructor(filename) {
        this.filename = filename;
        this.readRows = 0;
        this.invalidRows = 0;
        this.finishedReading = false;
        this.data = [];
        // console.log('TestModule: TR: created new TestResults:', this);

    }

    getClassEntry(className) {
        let foundClass = false;
        let currentClass = undefined;

        // this.data.forEach(classentry => {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].nodeName == className) {
                foundClass = true;
                currentClass = this.data[i];
            }
        }
        // });
        if (!foundClass) {
            currentClass = new TestClassEntry(className);
            this.data.push(currentClass);
        }
        return currentClass;
    }

    addEntry(className, functionName, entry) {
        let classEntry = this.getClassEntry(className);
        let foundFunction = false;
        let functionEntry = undefined;
        // classEntry.nodeEntries.forEach(funcentry => {
        for (let i = 0; i < classEntry.nodeEntries.length; i++) {
            if (classEntry.nodeEntries[i].nodeName == functionName) {
                foundFunction = true;
                functionEntry = classEntry.nodeEntries[i];
            }
        }
        // });
        if (!foundFunction) {
            functionEntry = new TestFunctionEntry(functionName);
            classEntry.nodeEntries.push(functionEntry);
        }
        functionEntry.nodeEntries.push(entry);
        if (!entry.nodeSuccess) {
            classEntry.nodeSuccess = false;
            functionEntry.nodeSuccess = false;
        }
    }
}



let validColumnFields = ['Time', 'Result', 'Class', 'Function', 'Line', 'AssertType', 'Comment'];

exports.testResults = {};
exports.columnMap = [];
let readFirstLine = false;

// exports.filename = 'bogusTest.log';
// exports.readRows = 0;
// exports.invalidRows = 0;
// exports.finishedReading = false;
// exports.testData = [];
// exports.passedCount = 0;
// exports.failedCount = 0;

// let currentClassName = '';
// let tempClassName = '';
// let currentFunctionName = '';
// let tempFunctionName = '';
// let currentClassObject = {};
// let currentFunctionObject = {};

// let currentClass = {};
// let currentFunction = {};
// let currentClassArray = [];
// let currentEntryArray = [];

// let exampleDataEntry = [{
//     nodeName: 'name', nodeSuccess: true,
//     nodeEntries: [{
//         nodeName: 'fname', nodeSuccess: true,
//         nodeEntries: [{ nodeTime: 1234, nodeSuccess: true, nodeLine: 23, nodeAssertType: 'ASSERT_EQUAL', nodeComment: 'comment' }]
//     }]
// }];


const resetTestData = (filename) => {
    // console.log("TestModule: resetTestData: resetting test data");
    this.testResults = new TestResults(filename);
    this.columnMap = [];
    readFirstLine = false;

    // this.filename = filename;
    // this.readRows = 0;
    // this.invalidRows = 0;
    // this.finishedReading = false;
    // this.columnMap = [];
    // this.testData = [];
    // this.passedCount = 0;
    // this.failedCount = 0;


    // currentClassName = '';
    // tempClassName = '';
    // currentFunctionName = '';
    // tempFunctionName = '';
    // currentClassObject = {};
    // currentFunctionObject = {};
    // currentClassArray = [];
    // currentEntryArray = [];
    // currentClass = new TestClassEntry('');
    // console.log("TestModule: resetTestData: currentClassName: ", currentClass.nodeName, ` (${typeof currentClass.nodeName})`);
    // currentClass.nodeName = '';
    // console.log("TestModule: resetTestData: (after) currentClassName: ", currentClass.nodeName, ` (${typeof currentClass.nodeName})`);
    // currentFunction = new TestFunctionEntry('');
    // currentClass.nodeEntries.push(currentFunction);
    // this.testResults.data.push(currentClass);
};

const parseLineArray = (lineArray) => {
    if (lineArray.length < this.columnMap.length) {
        // console.log(`colMap.l: ${colMap.length} - ignoring this line ${lineArray.length}:`, lineArray.join());
        this.testResults.invalidRows++;
    }
    else {
        let entry = { nodeType: 'entryNode', nodeExpanded: false };
        let tempClassName = '';
        let tempFunctionName = '';
        for (let i = 0; i < this.columnMap.length; i++) {
            switch (this.columnMap[i]) {
                case 0: /* Time */
                    entry.nodeTime = lineArray[i];
                    // row.time = parseDate(lineArray[i]);  // TODO implement this
                    break;
                case 1: /* Result */
                    if ((lineArray[i].toLowerCase() == 'success') ||
                        (lineArray[i].toLowerCase() === 1) ||
                        (lineArray[i].toLowerCase() == 'passed') ||
                        (lineArray[i].toLowerCase() == 'pass')) {
                        entry.nodeSuccess = true;
                    }
                    else {
                        entry.nodeSuccess = false;
                    }
                    break;
                case 2: /* Class */
                    tempClassName = lineArray[i];
                    break;
                case 3: /* Function */
                    tempFunctionName = lineArray[i];
                    break;
                case 4: /* Line */
                    entry.nodeLine = lineArray[i];
                    break;
                case 5: /* AssertType */
                    entry.nodeAssertType = lineArray[i];
                    break;
                case 6: /* Comment */
                    entry.nodeComment = lineArray[i];
                    break;
                default:
                    break;
            }
        }
        /* TODO add INI variable: collect entries => check if class/function name in data array */
        // console.log(`TestModule: parseLine: comparing classes: tmp: ${tempClassName} (${typeof tempClassName}) -- cur: ${currentClass.nodeName} (${typeof currentClass.nodeName}) -- isEqual: ${(tempClassName == currentClass.nodeName)}`);
        // console.log(`TestModule: parseLine:`, currentClass.nodeName);
        this.testResults.addEntry(tempClassName, tempFunctionName, entry);
    }
};


const parseLine = async (line) => {
    // await utilities.delay(1000);
    if (line.charAt(0) != '#') {
        let rar = line.split(settings.General.tableSeparator);
        let validColumnAssignments = true;
        let foundRightField;
        if (!readFirstLine) {
            readFirstLine = true;
            // console.log("TestModule: parseLine(): reading first line:", rar, 'rar.l:', rar.length, 'validColumnFields.l:', validColumnFields.length);
            for (let col = 0; col < rar.length; col++) {
                // console.log("TestModule: parseLine(): col:", col);
                foundRightField = false;
                if (validColumnAssignments) {
                    for (let fi = 0; fi < validColumnFields.length; fi++) {
                        // console.log("comparing", rar[col], " and ", validMLVDebugFields[fi]);
                        if (rar[col] == validColumnFields[fi]) {
                            this.columnMap.push(fi);
                            foundRightField = true;
                            break;
                        }
                    }
                    if (!foundRightField) { validColumnAssignments = false; }
                }
            }
            if (!validColumnAssignments) {
                this.columnMap = [];
                this.columnMap.push(0);
                this.columnMap.push(1);
                this.columnMap.push(2);
                this.columnMap.push(3);
                this.columnMap.push(4);
                this.columnMap.push(5);
                this.columnMap.push(6);

                parseLineArray(rar);
            }
            // console.log("colMap:", this.columnMap, "validColAss:", validColumnAssignments);
            // currentDebugWindow.webContents.send("initializeDebug", { idFilename: this.filename, idColumnMap: this.columnMap });
        }
        else {
            parseLineArray(rar);
        }
        // console.log("row:", line, "\t[0]:", rar[0]);
    }

    // console.log(`Line from file: ${line}, levelCount.l: ${this.levelCount.length}, fn: ${this.filename}`);
    // console.log(this.mlvDebugSummary);
};


exports.loadMLVTestFile = async (window, filepath, filename, allSettings) => {
    // console.log("TestModule: loadFile(): filename: ", filename, 'lineSeparator: ', allSettings.General.tableSeparator);
    settings = allSettings;
    currentWindow = window;
    resetTestData(filename);
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(filepath, filename)),
        crlfDelay: Infinity
    });

    readFirstLine = false;
    flushCounter = 0;
    rl.
        on('line', (line) => {
            this.testResults.readRows++;
            parseLine(line);
            // if (this.testResults.readRows % updateUIevery === 10) {
                // console.log("Flushing Test data");
                // currentWindow.webContents.send("ipcDebugSummary", this.mlvDebugSummary);
                // currentWindow.webContents.send("ipcDebugSummary", this.filename);  // BUG CHANGE THIS TO UPDATE DATA
                // this.mlvDebugSummary.readRows = 0;
            // }
        })
        .on('close', () => {
            // console.log("ended reading test file");
            this.testResults.finishedReading = true;
            // console.log("TestModule: loadFile: ", this.testResults);
            // currentWindow.webContents.send("ipcDebugSummary", this.mlvDebugSummary);
            // currentWindow.webContents.send("ipcDebugSummary", this.filename);  // BUG CHANGE THIS TO UPDATE DATA
        });
};
