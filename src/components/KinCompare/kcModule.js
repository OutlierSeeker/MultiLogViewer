const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { columnMap } = require('../MLVFunctionTimes/mlvTimesModule');

class TableObject {
    constructor() {
        this.baseTable = [];
        this.filteredTable = [];
        this.shownTable = [];
        this.savedFilters = []; /* { key: [] ('filterAll' -> search all keys), value, code } */
        this.numberOfRowsToDisplay = 10;
        // this.currentFilter = {};
        // this.defaultDisplayRows = 25;
        // this.displayRowOptions = [5, 25, 50, 100, 250, 1000, 'All'];
        this.availableFilters = []; /* { key, display, isNumber} */
    }
}


class KinCompareData {
    constructor(filename) {
        this.filename = filename;
        this.readRows = 0;
        this.invalidRows = [];
        this.nullRows = { self: 0, two: 0 }; /* rows with prohibited comparisons (self-null, null-null) */
        this.finishedReading = false;
        this.rowTableObject = new TableObject();
        this.rowTableObject.availableFilters = [
            { key: ['filterAll'], display: 'All Columns', isNumber: false },
            { key: ['name1', 'name2'], display: 'Entry Names', isNumber: false },
            { key: ['ID1', 'ID2'], display: 'Entry IDs', isNumber: true },
            { key: ['name1'], display: 'Entry 1 Name', isNumber: false },
            { key: ['ID1'], display: 'Entry 1 ID', isNumber: true },
            { key: ['name2'], display: 'Entry 2 Name', isNumber: false },
            { key: ['ID2'], display: 'Entry 2 ID', isNumber: true },
            { key: ['result'], display: 'Result', isNumber: true },
            { key: ['method'], display: 'Method', isNumber: false },
            { key: ['depth'], display: 'Depth', isNumber: true },
        ];
        // this.rowEntries = [];
        this.compareEntries = [];
    }

    addGroupEntry(entry) {
        // console.log('KinCompare: addEntry:', entry);
        let rea;
        let ce;
        if (entry.name1 != '--') {
            rea = this.compareEntries.filter(e => e.name == entry.name1);
            if (rea.length == 0) {
                ce = { name: entry.name1, id: entry.ID1, comparisons: [], };
                this.compareEntries.push(ce);
            }
            else { ce = rea[0]; }
            // this.addComparison(entry.name2, entry.ID2, entry.method, entry.result, entry.depth);
            ce.comparisons.push({
                otherName: entry.name2,
                otherID: entry.ID2,
                method: entry.method,
                result: entry.result,
                depth: entry.depth,
            });
        }
        if ((entry.name2 != '--') && (entry.name2 != 'SELF')) {
            rea = this.compareEntries.filter(e => e.name == entry.name2);
            if (rea.length == 0) {
                ce = { name: entry.name2, id: entry.ID2, comparisons: [], };
                this.compareEntries.push(ce);
            }
            else { ce = rea[0]; }
            ce.comparisons.push({
                otherName: entry.name1,
                otherID: entry.ID1,
                method: entry.method,
                result: entry.result,
                depth: entry.depth,
            });
        }
    }
}


let settings;
let currentWindow; /* TODO window is not needed anymore? */

let validColumnFields = [
    'ResultMethod',
    'Name1',
    'ID1',
    'Name2',
    'ID2',
    'Result',
    'Depth',
];

exports.columnMap = [];
exports.kcCompares = {};
let readFirstLine = false;

const resetData = (filename) => {
    this.kcCompares = new KinCompareData(filename);
    this.columnMap = [];
    readFirstLine = false;
}

/* entry: { method: , name1, ID1, name2, ID2, result, depth } */
const parseLineArray = (lineArray) => {
    if (lineArray.length < this.columnMap.length) {
        this.kcCompares.invalidRows++;
    }
    else {
        let entry = {};
        let validRow = true;
        for (let i = 0; i < this.columnMap.length; i++) {
            switch (this.columnMap[i]) {
                case 0: /* ResultMethod */
                    entry.method = lineArray[i];
                    break;
                case 1: /* #Name1 */
                    entry.name1 = lineArray[i];
                    break;
                case 2: /* ID1 */
                    entry.ID1 = Number(lineArray[i]);
                    if (isNaN(entry.ID1)) {
                        validRow = false;
                    }
                    break;
                case 3: /* Name2 */
                    entry.name2 = lineArray[i];
                    break;
                case 4: /* ID2 */
                    entry.ID2 = Number(lineArray[i]);
                    if (isNaN(entry.ID2)) {
                        validRow = false;
                    }
                    break;
                case 5: /* Result */
                    entry.result = Number(lineArray[i]);
                    if (isNaN(entry.result)) {
                        validRow = false;
                    }
                    break;
                case 6: /* Depth */
                    entry.depth = Number(lineArray[i]);
                    if (isNaN(entry.depth)) {
                        validRow = false;
                    }
                    break;
                default:
                    break;
            }
        }

        if (validRow) {
            if (entry.name2 == 'SELF') {
                if ((entry.name1 == '--') || (entry.ID1 === 0)) {
                    validRow = false;
                    this.kcCompares.nullRows.self++;
                }
            }
            else if ((entry.name1 == '--') && (entry.name2 == '--')) {
                validRow = false;
                this.kcCompares.nullRows.two++;
            }
            if (validRow) {
                this.kcCompares.rowTableObject.baseTable.push(entry);
                this.kcCompares.addGroupEntry(entry);
            }
        }
        else {
            console.log('kcMod: parseLA: invalid Row: ', lineArray);
            this.kcCompares.invalidRows++;
        }
    }
}


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
                    }
                }
            }
            if (!validColumnAssignments) {
                this.columnMap = [];
                for (let i = 0; i < validColumnFields.length; i++) {
                    this.columnMap.push(i);
                }
                parseLineArray(rar, line);
            }
        }
        else {
            parseLineArray(rar, line);
        }
    }
};


exports.loadKinCompareFile = async (window, filepath, filename, allSettings) => {
    currentWindow = window;
    settings = allSettings;
    resetData(filename);
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(filepath, filename)),
        crlfDelay: Infinity
    });

    readFirstLine = false;
    rl.
        on('line', (line) => {
            this.kcCompares.readRows++;
            parseLine(line);
        })
        .on('close', () => {
            this.kcCompares.finishedReading = true;
        });
};
