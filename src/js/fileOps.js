const { dialog } = require('electron');
const fs = require('fs');
// const { resolve } = require('path');
const path = require('path');
// const settings = require('./settings');
// const modules = require('./modules');
const utilities = require('./utilities');

// TODO load modules conditionally
exports.mlvdebug = require('../components/MLVDebug/mlvDebugModule');
exports.mlvtest = require('../components/MLVTest/mlvTestModule');
exports.mlvtimes = require('../components/MLVFunctionTimes/mlvTimesModule');
exports.kincompares = require('../components/KinCompare/kcModule');

let generalSettings;
exports.fileData = { foundValidFolder: false };

exports.loadModules = (window) => {
    // loadModules = this.fileData.activeMods.map(e => e.module);
    // console.log('index loadModules:', loadModules);
    for (let i = 0; i < this.fileData.activeMods.length; i++) {
        // console.log(`fileops: loadModules: this.fileData.activeMods[${i}]: `, this.fileData.activeMods[i]);
        /* TODO make this as workers */
        if (this.fileData.activeMods[i].module == 'MLVDebug') {
            // mlvdebug.filename = this.fileData.activeMods[i].file;
            // console.log("found debug module");
            this.mlvdebug.loadMLVDebugFile(window, this.fileData.validFolderName, this.fileData.activeMods[i].file, generalSettings);
        }
        else if (this.fileData.activeMods[i].module == 'MLVTest') {
            // console.log("index: newWindows: found MLVTest");[i][i]
            this.mlvtest.loadMLVTestFile(window, this.fileData.validFolderName, this.fileData.activeMods[i].file, generalSettings);
        }
        else if (this.fileData.activeMods[i].module == 'MLVFunctionTimes') {
            this.mlvtimes.loadMLVTimesFile(window, this.fileData.validFolderName, this.fileData.activeMods[i].file, generalSettings);
        }
        else if (this.fileData.activeMods[i].module == 'KinCompare') {
            this.kincompares.loadKinCompareFile(window, this.fileData.validFolderName, this.fileData.activeMods[i].file, generalSettings);
        }
        /* TODO add other modules */
    }
};

exports.setGeneralSettings = (gs) => {
    generalSettings = gs;
}

exports.isFile = input => {
    let stats;
    try {
        stats = fs.lstatSync(input);
        if (stats.isFile()) { return true; }
        else { return false; }
    }
    catch (e) { return false; }
};

exports.isFolder = input => {
    let stats;
    try {
        stats = fs.lstatSync(input);
        if (stats.isDirectory()) { return true; }
        else { return false; }
    }
    catch (e) { return false; }
};

const getValidLogFiles = (inputpath) => {
    // console.log(`fileOps: getValidLogFiles: gs: ${JSON.stringify(generalSettings)}`);
    let activeModsInSettings = generalSettings.getActiveModuleSummaries();
    if (activeModsInSettings.length === 0) { return []; }
    const fullPathFiles = fs.readdirSync(inputpath).map(fileName => {
        return path.join(inputpath, fileName);
    }).filter(this.isFile);
    // console.log("fileOps: getValidLogFiles: fullpathfiles:", fullPathFiles, ` - inputPath: ${inputpath}`);
    let baseFiles = fullPathFiles.map((full) => {
        return path.basename(full);
    });
    if (baseFiles.length === 0) { return []; }

    let activeMods = [];
    baseFiles.forEach(filename => {
        activeModsInSettings.forEach(module => {
            if (module.filenames.includes(filename) && (activeMods.indexOf(module) === -1)) {
                // activeMods.push(module.name);
                activeMods.push({ module: module.moduleName, file: filename });
            }
        });
    });
    // console.log("base files:", baseFiles);
    // console.log('logmods:', generalSettings.logModules);
    console.log('activeMods:', activeMods);
    return activeMods;
};

const getFullParentDirectoryPath = subDir => {
    return path.join(subDir, '..');
    // return path.dirname(subDir).split(path.sep).pop();
};

const getCurrentDirectoryName = dir => {
    // let arr = path.dirname(dir).split(path.sep);     // <- gets parent directory
    let arr = dir.split(path.sep);
    // console.log(arr);
    return arr.length > 0 ? arr[arr.length - 1] : '';
};

const getParentDirectoryName = subDir => {
    // return path.join(subDir, '..');
    return path.dirname(subDir).split(path.sep).pop();
};

const setX = async (val) => {
    let x = {};
    await utilities.delay(2000);
    x = { 'canceled': true, 'value': val };
    x.value = val;
    return x;
}

exports.test = async (val) => {
    // setX(5)
    //     .then(result => { return result; });
    let x = {};
    console.log("starting open...", x);
    await utilities.delay(val);
    x = { 'canceled': true, 'value': val };
    console.log("ending open...", x);
    return x;
}

exports.openLogFolder = (folder) => {
    // console.log(`fileOps: openLogFolder: folder: `, folder, `, fileops.modules:`, generalSettings.logModules);
    let data = { foundValidFolder: false, inputPath: folder }
    if (!this.isFolder(folder)) {
        data.invalidFolder = true;
        return data;
    }
    else {
        data.activeMods = getValidLogFiles(folder);
        if (data.activeMods.length > 0) {
            // console.log("found valid files in dir:", folder);
            data.foundValidFolder = true;
            data.validFolderName = folder;
            if (generalSettings.General.useDescriptiveDirectoryName &&
                generalSettings.General.validLogDirectoryNames.includes(getCurrentDirectoryName(data.validFolderName))) {
                // console.log("dir is a log folder: ", getCurrentDirectoryName(data.validFolderName));
                data.displayName = getParentDirectoryName(data.validFolderName);
            }
            else {
                data.displayName = getCurrentDirectoryName(data.validFolderName);
            }
            // console.log("displayName:", data.displayName);
        }
        else {
            console.log("Did not find valid files");
            if (generalSettings.General.checkSubdirectoryForLog && generalSettings.General.validLogDirectoryNames.length > 0) {
                generalSettings.General.validLogDirectoryNames.forEach(sub => {
                    if (!data.foundValidFolder) {
                        let subFolder = path.join(folder, sub);
                        try {
                            if (fs.existsSync(subFolder)) {
                                data.activeMods = getValidLogFiles(subFolder);
                                if (data.activeMods.length > 0) {
                                    console.log("found valid files in subdir:", subFolder);
                                    data.foundValidFolder = true;
                                    data.validFolderName = subFolder;
                                    data.displayName = getParentDirectoryName(folder);
                                }
                            }
                        } catch (e) {
                            console.log("ERROR: ", e);
                        }
                    }
                });
            }
            else {
                /** TODO implement option to display assignment window if folder exists but does not contain obviously valid fiels */
            }
        }
        // console.log(`fileOps: openLogFolder: returning: `, data);
        // this.fileData = data;
        return data;    // TODO deprecated, should delete
    }
};

exports.openFolderDialog = async () => {
    // console.log("fileOPs: openFolderDialog: opening dialog...");
    return data = await dialog.showOpenDialog({
        title: "Open Log Directory",
        buttonLabel: "Open Logs",
        properties: ['openDirectory']
    });

    // console.log("fileops: dialogData:", data);
    // if (data.canceled) {
    //     data.foundValidFolder = false;
    //     return data;
    // }
    // else {
    //     data = this.openLogFolder(data.filePaths[0]);
        // // BUG this will not work, or will it?
        // data.activeMods = getValidLogFiles(data.filePaths[0]);
        // console.log("getFullParentDirectoryPath:", getFullParentDirectoryPath(data.filePaths[0]));
        // console.log("getParentDirectoryName:", getParentDirectoryName(data.filePaths[0]));
        // console.log("currentDir:", getCurrentDirectoryName(data.filePaths[0]));
        // if (data.activeMods.length > 0) {
        //     console.log("found valid files in dir:", data.filePaths[0]);
        //     data.foundValidFolder = true;
        //     data.validFolderName = data.filePaths[0];
        //     if (generalSettings.General.useDescriptiveDirectoryName &&
        //         generalSettings.General.validLogDirectoryNames.includes(getCurrentDirectoryName(data.validFolderName))) {
        //         console.log("dir is a log folder: ", getCurrentDirectoryName(data.validFolderName));
        //         data.displayName = getParentDirectoryName(data.validFolderName);
        //     }
        //     else {
        //         data.displayName = getCurrentDirectoryName(data.validFolderName);
        //     }
        // }
        // else {
        //     console.log("Did not find valid files");
        //     if (generalSettings.General.checkSubdirectoryForLog && generalSettings.General.validLogDirectoryNames.length > 0) {
        //         generalSettings.General.validLogDirectoryNames.forEach(sub => {
        //             if (!data.foundValidFolder) {
        //                 let subFolder = path.join(data.filePaths[0], sub);
        //                 try {
        //                     if (fs.existsSync(subFolder)) {
        //                         data.activeMods = getValidLogFiles(subFolder);
        //                         if (data.activeMods.length > 0) {
        //                             console.log("found valid files in subdir:", subFolder);
        //                             data.foundValidFolder = true;
        //                             data.validFolderName = subFolder;
        //                             data.displayName = getParentDirectoryName(data.filePaths[0]);
        //                         }
        //                     }
        //                 } catch (e) {
        //                     console.log("ERROR: ", e);
        //                 }
        //             }
        //         });
        //     }
        // }
    // }
    // console.log("data (b):", data);
    // this.fileData = data;
    // return data;
}
