const utilities = require('./utilities');
const { BrowserWindow, ipcMain } = require('electron');
// const mlvdebug = require('../components/MLVDebug/mlvDebug');

let tm = 13;
exports.testModules = () => {
    return tm;
};
exports.increaseTM = () => { tm++; }
exports.getTM = () => { return tm; }

exports.runDelayedTest = async () => {
    await utilities.delay(2000);
    this.tm = 26;
}

exports.debugModuleData = { dCount: 42 };

// exports.mlvDebugSummaryTest = { x: 0, finished: false };
// exports.mlvLoadDebugTest = (window) => {
//     this.mlvDebugSummary.x = 0;
//     this.mlvDebugSummary.finished = false;
//     // while (!this.mlvDebugSummary.finished) {
//     //     // await utilities.delay(150);
//     //     this.mlvDebugSummary.x++;
//     //     if (this.mlvDebugSummary.x === 200) { this.mlvDebugSummary.finished = true; }
//     // }
//     const timer = setInterval(() => {
//         console.log("loading...", this.mlvDebugSummary.x, "window:", window.loadedHTML);
//         if (!this.mlvDebugSummary.finished) {

//             this.mlvDebugSummary.x++;
//             if (this.mlvDebugSummary.x > 100) {
//                 this.mlvDebugSummary.finished = true;
//                 clearInterval(timer);
//             }
//             // window.webContents.send("loadDataChannel", this.mlvDebugSummary);
//         }
//     }, 150);
// };

// // let loadDebugData = {};
// // exports.loadData = async (folderInfo, myCount) => {
// //     console.log("loadData:", folderInfo.validFolder);
// //     for (let i = 1; i < 1000000; i++) {
// //         await utilities.delay(10);
// //         this.debugModuleData.dCount = i;
// //     }
// // }


// exports.mlvDebugSummary = { x: 0, finished: false };
// exports.loadData = (window, fileData) => {
//     if (window.loadedHTML === 'index') {
//         console.log("sending data:", fileData.displayName);
//         window.webContents.send("ipcFileData", fileData);
//         for (let i = 0; i < fileData.activeMods.length; i++) {
//             // console.log("lD:", i, ", fileData.activeMods[i]:", fileData.activeMods[i]);
//             if (fileData.activeMods[i].module == 'MLVDebug') {
//                 // console.log("found debug module");
//                 mlvdebug.loadMLVDebugFile(window, fileData.validFolderName, fileData.activeMods[i].file);
//             }
//             else if (fileData.activeMods[i] == 'MLVTest') {

//             }
//             /* TODO add other modules */
//         }
//     }
//     else if (window.loadedHTML === 'index') {
//         /* load launcher data */
//     }
// };