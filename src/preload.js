const { contextBridge, ipcRenderer } = require('electron');
// const { cpus } = require('os');
// const modules = require('./js/modules');
// const utilities = require('./js/utilities');
// const index = require('./index');
// const mlvDebug = require('./components/MLVDebug/mlvDebug');


const API = {
    // cpus: cpus(),
    // sendMsg: (msg) => ipcRenderer.send("message", msg),
    // modulesAPI: modules,
    // utilitiesAPI: utilities,

    openFolderDialogR2M: () => ipcRenderer.send("openFolderDialogR2M"),
    openFolderR2M: (folder) => ipcRenderer.send("openFolderR2M", folder),
    // openFolderResultM2R: (callback) => ipcRenderer.send("openFolderResultM2R", callback),

    fileDataR2M: () => ipcRenderer.send("fileDataR2M"),
    initializeFileDataM2R: (callback) => ipcRenderer.on("initializeFileDataM2R", (event, args) => { callback(args); }),

    settingsRequestR2M: () => ipcRenderer.send("settingsRequestR2M"),
    settingsM2R: (callback) => ipcRenderer.on("settingsM2R", (event, args) => { callback(args); }),
    saveSettingsR2M: (settings) => ipcRenderer.send("saveSettingsR2M", settings),

    debugDataR2M: () => ipcRenderer.send("debugDataR2M"),
    debugDataM2R: (callback) => ipcRenderer.on("debugDataM2R", (event, args) => { callback(args); }),

    testDataR2M: () => ipcRenderer.send("testDataR2M"),
    testDataM2R: (callback) => ipcRenderer.on("testDataM2R", (event, args) => callback(args)),

    functionTimesDataR2M: () => ipcRenderer.send("functionTimesDataR2M"),
    functionTimesDataM2R: (callback) => ipcRenderer.on("functionTimesDataM2R", (event, args) => callback(args)),

    kinCompareDataR2M: () => ipcRenderer.send("kinCompareDataR2M"),
    kinCompareDataM2R: (callback) => ipcRenderer.on("kinCompareDataM2R", (event, args) => callback(args)),

    // settingsM2R: (callback) => ipcRenderer.on("settingsM2R", (event, args) => { callback(args) }),
    // settingsM2R: (callback) => ipcRenderer.send("settingsR2M", settings),
    // mlvDebugAPI: mlvDebug,
    // indexAPI: index,
    // onFileData: (callback) => ipcRenderer.on("ipcFileData", (event, args) => {
    //     // console.log("passing fileData:", fileData.displayName);
    //     callback(args);
    // }),
    // onLoadData: (callback) => ipcRenderer.on("loadDataChannel", (event, args) => {
    //     callback(args);
    // }),
    // getTMAPI: (msg) => {
    //     console.log("getTMAPI...", modules.getTM());
    //     modules.increaseTM();
    //     modules.increaseTM();
    //     ipcRenderer.send("getTM", msg);
    // },
    // onDebugSummary: (callback) => ipcRenderer.on("ipcDebugSummary", (event, args) => {
    //     // console.log("mlvDebugSummary:", args);
    //     callback(args);
    // }),

    // onFileData: (callback3) => ipcRenderer.on("sendFileData", (event, args) => {
    //     console.log("passing fileData...", args.displayName);
    //     callback3(args);
    // }),
}

contextBridge.exposeInMainWorld("mlvAPI", API);