// TODO show current log files present in valid recent folders (debug), etc. 
// TODO implement a refresh button + autorefresh option
// TODO write tests
// TODO replace forEach with for(... of ...): https://stackoverflow.com/questions/50844095/should-one-use-for-of-or-foreach-when-iterating-through-an-array
// TODO multiple module files at the same time?
/* TODO rename 'index' to 'main' */
/* TODO conditional module loading, e.g.: 
  let  mlvdebug;
  if(mlvdug?.loaded) { mlvdebug = require...; }
*/
/* TODO add flushing data to all modules */
/* TODO Settings:
  * open folder even if no valid files
*/

const settings = require('./js/settings');
// console.log(`index: creating genSets...`);
let generalSettings = settings.createGeneralSettingsObject();
const iniOps = require('./js/iniOps');
let iniConfig = iniOps.getGlobalINIConfig();
// console.log(`index: Settings: General: searchInputDelay: ${iniConfig.General.searchInputDelay}...`);
// console.log(`index: setting General ${iniConfig.General.numberOfLastDirectories}...`);
generalSettings.setSettings(iniConfig, false);
// console.log(`index: setting General ${generalSettings.}...`);
const fileops = require('./js/fileOps');
fileops.setGeneralSettings(generalSettings);

// TODO other settings as objects!
// const mlvdebug = require('./components/MLVDebug/mlvDebugModule');
// const mlvtest = require('./components/MLVTest/mlvTestModule');
// const mlvtimes = require('./components/MLVFunctionTimes/mlvTimesModule');
// const kincompares = require('./components/KinCompare/kcModule');

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { inflateRaw } = require('zlib');
// const { data } = require('./js/stores');
// const modules = require('./js/modules');
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// let loadModules;
let openWindows = [];
let currentMode = '';

const addWindow = (window) => {
  openWindows.push(window);
  currentMode = window.loadedHTML;
};

const removeWindow = (window) => {
  // console.log("calling:", window);
  // console.log("removing window: ", window.loadedHTML, "oW.length:", openWindows.length);
  const index = openWindows.indexOf(window);
  // console.log("index of windows is:", index);
  if (index > -1) {
    openWindows.splice(index, 1);
  }
  else {
    console.log("Strange, cannot find window...");
  }
}

const newWindow = (htmlFile) => {
  // console.log(`index: newWindow: fileData: `, fileData);
  let window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    }
  });
  // openWindows.push(window);
  if (htmlFile == 'index' || !fileops.fileData.activeMods || fileops.fileData.activeMods.length === 0) {
    window.loadedHTML = 'index';
    window.loadFile(path.join(__dirname, '../public/index.html'));

    // fileops.loadModules(window);
  }
  else {
    window.loadedHTML = 'launcher';
    window.autoHideMenuBar = false;
    window.loadFile(path.join(__dirname, '../public/launcher.html'));
    // window.setSize(740, 500);
    window.resizable = false;
  }

  addWindow(window);

  if ((htmlFile === 'index' || htmlFile === 'launcher') && (openWindows.length > 1)) {
    for (let i = 0; i < (openWindows.length - 1); i++) {
      openWindows[i].close();
    }
  }

  // window.on("ready-to-show", window.show);
  window.on("ready-to-show", () => {
    window.show();
    // window.setSize(1000, 800);
    generalSettings.setWindowStats(window);
    // console.log(`index: on'ready-to-show': rendSettings:`, generalSettings.getRendererSettings());
    // window.webContents.send("settingsM2R", generalSettings.getRendererSettings());
  });

  window.on("closed", () => {
    removeWindow(window);
  });

  window.on("moved", () => {
    writeWindowStats(window);
  });

  window.on("resized", () => {
    writeWindowStats(window);
  });

  window.webContents.openDevTools({ mode: "detach" });
  return window;
}

function openFolder(folder) {
  console.log(`index: openFolder: ${folder}`);
  let window;
  let isNewWindow = true;
  let newData = fileops.openLogFolder(folder);
  // console.log(`index: openFolder: fileData:`, fileops.fileData);
  if (newData.invalidFolder) { return "Cannot open Folder - invalid folder."; }
  if (newData.foundValidFolder || generalSettings.General.loadDirectoryWithoutValidFiles) {
    // console.log(`index: openFolder: openWindows.l:`, openWindows.length);
    fileops.fileData = newData;
    if (openWindows.length === 0) {
      window = newWindow("index");
    }
    else {
      for (let i = 0; i < openWindows.length; i++) {
        let toClose = [];
        let foundIndex = -1;
        if (openWindows[i].loadedHTML == 'index') {
          window = openWindows[i];
          foundIndex = i;
        }
        else { toClose.push(openWindows[i]); }

        if (foundIndex === -1) { window = newWindow('index'); }
        else { isNewWindow = false; }
        for (w of toClose) { w.close(); }
      }
    }
    // window.webContents.send("resetDataM2R", fileops.fileData);
    if (!isNewWindow) {
      window.webContents.send("initializeFileDataM2R", fileops.fileData);
    }
    // console.log(`index: openFolder: fileData:`, fileops.fileData);
    fileops.loadModules(window);
    generalSettings.addLastDir(folder);
    return '1';
  }
  else {
    return "Can not open folder - no valid log files found.";
  }

}

let resizeWindowTimeout = undefined;
function writeWindowStats(window) {
  if (generalSettings.General.saveWindowSettings) {
    if (typeof resizeWindowTimeout != 'undefined') {
      clearTimeout(resizeWindowTimeout);
    }
    resizeWindowTimeout = setTimeout(() => {
      generalSettings.saveWindowStats(window.loadedHTML, window.getPosition(), window.getSize());
      iniOps.writeGlobalINIConfig(generalSettings);
    }, 250);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // let fileData = { foundValidFolder: false };
  let lastDirectories = [...generalSettings.General.lastDirectories];
  let foundFolder = false;
  // console.log("index: on'ready': lastdirs:", lastDirectories);
  // console.log(JSON.stringify(generalSettings));
  if (generalSettings.General.loadLastDirectory && lastDirectories.length > 0) {
    for (let i = 0; i < generalSettings.General.lastDirectories.length; i++) {
      // console.log("i:", i, `, lD: ${lastDirectories[i]}`);
      // fileops.openLogFolder(lastDirectories[i]);
      // if (fileops.fileData.foundValidFolder) {
      //   newWindow('index');
      //   console.log("found valid folder:", lastDirectories[i], ":\nfileData:", fileops.fileData);
      //   break;
      // }
      if (openFolder(generalSettings.General.lastDirectories[i]) == '1') { foundFolder = true; break; }
      // else {
      //   console.log("deleting invalid folder", lastDirectories[i]);
      //   generalSettings.General.lastDirectories.splice(i, 1);
      // }
    }
  }

  if (!foundFolder) {
    console.log("found nothing -> launcher");
    newWindow('launcher');
  }

  // newWindow('index', fileData);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => app.quit());


// ipcMain.on('openFolderDialog', (event, args) => {
//   console.log("openDialogMain:", args);
//   fileops.openDialog();
// })

ipcMain.on("message", (event, args) => {
  console.log("args:", args);
});

ipcMain.on("openFolderDialogR2M", () => {
  // fileops.openLogFolderDialog()
  //   .then((err, result) => {
  //     console.log('index: openFolderDialog: then:', result);
  //     // fileData = res;
  //     // console.log("fileData:", fileData);
  //     if (!fileops.fileData.canceled) {
  //       if (!fileops.fileData.foundValidFolder) {
  //         console.log('index: openFolderDialog: Did NOT find valid folder');
  //         // TODO display notification dialog
  //       }
  //       else {
  //         console.log('index: openFolderDialog: Found valid folder:', fileops.fileData.validFolderName);
  //         openFolder(fileops.fileData.validFolderName)
  //         // if (currentMode === 'launcher') {
  //         //   console.log("from launcher -> load index");
  //         //   let closeMe = BrowserWindow.getFocusedWindow();
  //         //   newWindow('index');

  //         //   // modules.loadData(fileData);

  //         //   closeMe.close();
  //         // }
  //         // else if (currentMode === 'index') {
  //         //   console.log("from index -> stay here");
  //         // }
  //       }
  //     }
  //   })
  //   .catch(err => { console.log("Error getting folder data: ", err) });
  console.log('index: openFolderDialog:');
  fileops.openFolderDialog().then(async (data) => {
    console.log('index: openFolderDialog: data:', data);
    if (data.canceled) {
      console.log('index: openFolderDialog: action canceled:');
    }
    else {
      openFolder(data.filePaths[0]);
    }
  }).catch(error => console.log(error));

  // console.log('index: openFolderDialog: data: ', data, ' - x: ', x);
});

ipcMain.on("openFolderR2M", (event, folder) => {
  console.log("index: openFolderR2M:", folder);
  openFolder(folder);
});

ipcMain.on("fileDataR2M", (event) => {
  openWindows[0].webContents.send("initializeFileDataM2R", fileops.fileData);
});

ipcMain.on("settingsRequestR2M", (event) => {
  // console.log(`index: settingsRequestR2M: got request for settings -> sending...`, generalSettings);
  openWindows[0].webContents.send("settingsM2R", generalSettings);
});

ipcMain.on("saveSettingsR2M", (event, args) => {
  // console.log("index: saveSettings: genSets searchInputDelay: ", generalSettings.General.searchInputDelay);
  let tmp = settings.createGeneralSettingsObject();
  // console.log("index: saveSettings: tmp searchInputDelay: ", tmp.General.searchInputDelay);
  tmp.setSettings(args);
  // console.log("index: saveSettings: tmp searchInputDelay: ", tmp.General.searchInputDelay);
  tmp.mergeWindowSettings(generalSettings);
  generalSettings = tmp;
  iniOps.writeGlobalINIConfig(generalSettings);
});

// TODO setSetting...

ipcMain.on("debugDataR2M", (event) => {
  // console.log("getting debug data...sender:", event.sender.id, " args: none");
  // console.log("windows:", openWindows);
  // console.log("sending", mlvdebug.filename, " and ", mlvdebug.sortedLevelCounts.length, ", finished:", mlvdebug.finishedReading);
  // console.log("index: getDebugDataR2M: readRows:", mlvdebug.readRows);
  // console.log("index: getDebugDataR2M: readRows:", fileops.mlvdebug.readRows);
  // console.log("index: debugDataR2M: getting request for debug data: readRows:", fileops.mlvdebug.readRows);
  openWindows[0].webContents.send("debugDataM2R", fileops.mlvdebug.getNewDebugData());
  // modules.increaseTM();
  // console.log("ipcMain: tm:", modules.getTM());
});

ipcMain.on("testDataR2M", (event) => {
  // console.log("index: testDataR2M: getting request");
  // console.log("windows:", openWindows);
  // console.log("sending", mlvdebug.filename, " and ", mlvdebug.sortedLevelCounts.length, ", finished:", mlvdebug.finishedReading);
  // console.log("index: getDebugDataR2M: readRows:", fileops.mlvdebug.readRows);
  // console.log("index: testDataR2M: getting request for test data: readRows:", fileops.mlvdebug.readRows);
  openWindows[0].webContents.send("testDataM2R", fileops.mlvtest.testResults);
  // modules.increaseTM();
  // console.log("ipcMain: tm:", modules.getTM());
});


ipcMain.on("functionTimesDataR2M", (event) => {
  // console.log("index: functionTimesDataR2M: getting request for function times: readRows:", fileops.mlvtimes.functionTimes.readRows);
  openWindows[0].webContents.send("functionTimesDataM2R", fileops.mlvtimes.functionTimes);
});


ipcMain.on("kinCompareDataR2M", (event) => {
  // console.log("index: kinCompareDataR2M: getting request for compares data: readRows:", fileops.kincompares.kcCompares.readRows);
  openWindows[0].webContents.send("kinCompareDataM2R", fileops.kincompares.kcCompares);
});

