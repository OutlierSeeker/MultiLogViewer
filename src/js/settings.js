const { TimeScale } = require("chart.js");

class GeneralSettings {
    constructor() {
        this.General = {};
        this.General.loadLastDirectory = false;
        this.General.numberOfLastDirectories = 5;   // ! requires verification on change
        this.General.lastDirectories = [
            "D:\\Files\\Nextcloud\\Dev\\Electron\\abcLogViewer (ini & file)\\log",
            "D:\\Files\\Nextcloud\\Dev\\Electron\\LogViewer (ini & file)\\log",
            "D:\\Files\\Nextcloud\\Dev\\Electron\\abcLogViewer (ini & file)\\log",
            "D:\\Files\\Nextcloud\\Dev\\Electron\\MultiLogViewer (dark mode)\\logs"];   // ! requires verification on change
        this.General.checkSubdirectoryForLog = true;
        this.General.validLogDirectoryNames = ['log', 'log2', 'logs'];
        this.General.useDescriptiveDirectoryName = true;
        this.General.loadDirectoryWithoutValidFiles = true;
        this.General.tableSeparator = ';';

        this.General.isDarkMode = false;
        this.General.saveWindowSettings = true;
        this.General.mainWindowPositionX = 98;
        this.General.mainWindowPositionY = 99;
        this.General.mainWindowWidth = 899;
        this.General.mainWindowHeight = 599;
        this.General.launcherWindowPositionX = 298;
        this.General.launcherWindowPositionY = 299;
        this.General.launcherWindowWidth = 601;
        this.General.launcherWindowHeight = 401;

        this.General.searchInputDelay = 501;
        this.General.defaultNumberOfTableRows = 31;
        this.General.rowNumberOptions = [4, 15, 30, 40, 100, 250, 500, 1000, -1]; // TODO add option to fit # rows to screen size
        this.General.numberOfPaginationButtonsOnTheSide = 3;    // at least 2
    }

    setSettings(settingsObject, ignoreWindowSettings = false) {
        if (Object.keys(settingsObject).length > 0) {
            // if ('General' in settingsObject) {
            for (const [catKey, catValue] of Object.entries(settingsObject)) {
                // console.log(`settingsObject: catKey: ${catKey} - catValue:\n`, catValue);
                if (catKey == 'General') {
                    // this.logModules = [];
                    if (Object.keys(catValue).length > 0) {
                        for (const [key, value] of Object.entries(catValue)) {
                            if (((typeof value) == 'string') && (key != 'tableSeparator')) {
                                this['General'][key] = parseInt(value);
                            }
                            else {
                                this['General'][key] = value;
                            }
                            // console.log(`settingsObject: set ${key} to `, this['General'][key], ` (${typeof this['General'][key]})`);
                        }
                    }
                }
                else {
                    if ('moduleName' in catValue) {
                        // console.log(`setSettins: found module: ${catValue.moduleName}`);
                        this[catValue.moduleName] = {};
                        // console.log(`setSettings: new Module:`, this[catValue.moduleName]);
                        // let module = {};
                        if (Object.keys(catValue).length > 0) {
                            for (const [key, value] of Object.entries(catValue)) {
                                this[catValue.moduleName][key] = value;
                                // module[key] = value;
                                // console.log(`settingsObject: ${catValue.moduleName}: set ${key} to `, this[catValue.moduleName][key]);
                                // console.log(`settingsObject: module: ${key} - ${value}`);
                            }
                            // { name: 'MLVDebug', active: true, filenames: ['debug.log', 'debug.csv', 'debugLog.csv'] },
                            // this.General.logModules.push(module);
                            // console.log(`setSettings: logmodules: ${JSON.stringify(this.logModules)}`);
                        }
                    }
                }
            }
        }
        // console.log("Settings: setSettings:", this);
    }

    setSetting(module, key, value) {
        // console.log(`setSetting: module: ${module}, key: ${key}, value: ${value}}, old value: ${this[module][key]}`);

        // console.log(`setSetting: old value: ${this[key]}`);
        // console.log(`setSetting: new value: ${this[key]}`);
        this[module][key] = value;
        // console.log(`setSetting: module: ${module}, key: ${key}, value: ${value}}, new value: ${this[module][key]}`);
    }


    setNumberOfLastDirs(number) {
        this.General.numberOfLastDirectories = number;
        this.General.lastDirectories = this.General.lastDirectories.slice(0, number);
    }

    addLastDir(dir) {
        if (this.General.numberOfLastDirectories.length > 1 && this.General.lastDirectories[0] != dir) {
            let arr = [...this.General.lastDirectories];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] == dir) {
                    this.General.lastDirectories.splice(i, 1);
                    break;
                }
            }
            this.General.lastDirectories.unshift(dir);
            if (this.General.lastDirectories.length > this.General.numberOfLastDirectories) {
                this.General.lastDirectories.splice(this.General.numberOfLastDirectories, 
                    (this.General.lastDirectories.length - this.General.numberOfLastDirectories));
            }
        }
    }

;

    saveWindowStats(loadedHTML, position, size) {
        if (this.General.saveWindowSettings) {
            console.log(`position: ${position}, size: ${size}`);
            if (loadedHTML === 'index') {
                this.General.mainWindowPositionX = position[0];
                this.General.mainWindowPositionY = position[1];
                this.General.mainWindowWidth = size[0];
                this.General.mainWindowHeight = size[1];
            }
            else if (loadedHTML === 'launcher') {
                this.General.launcherWindowPositionX = position[0];
                this.General.launcherWindowPositionY = position[1];
                this.General.launcherWindowWidth = size[0];
                this.General.launcherWindowHeight = size[1];
            }
        }
    }

    setWindowStats(window) {
        // console.log(`settings: setWindowStats: window: ${window.loadedHTML}: mwW: ${this.General.mainWindowWidth}, mwH: ${this.General.mainWindowHeight} / mwX: ${this.General.mainWindowPositionX}, mwY: ${this.General.mainWindowPositionY}`);
        // console.log(`settings: setWindowStats: typeof mwWidth: ${type this.General.mainWindowWidth}, mwH: ${this.General.mainWindowHeight} / mwX: ${this.General.mainWindowPositionX}, mwY: ${this.General.mainWindowPositionY}`);
        if (window.loadedHTML === 'index') {
            window.setSize(this.General.mainWindowWidth, this.General.mainWindowHeight);
            window.setPosition(this.General.mainWindowPositionX, this.General.mainWindowPositionY);
        }
        else if (window.loadedHTML === 'launcher') {
            window.setSize(this.General.launcherWindowWidth, this.General.launcherWindowHeight);
            window.setPosition(this.General.launcherWindowPositionX, this.General.launcherWindowPositionY);
        }
    }

    mergeWindowSettings(mergeSettings) {
        this.General.mainWindowPositionX = mergeSettings.General.mainWindowPositionX;
        this.General.mainWindowPositionY = mergeSettings.General.mainWindowPositionY;
        this.General.mainWindowWidth = mergeSettings.General.mainWindowWidth;
        this.General.mainWindowHeight = mergeSettings.General.mainWindowHeight;
        this.General.launcherWindowPositionX = mergeSettings.General.launcherWindowPositionX;
        this.General.launcherWindowPositionY = mergeSettings.General.launcherWindowPositionY;
        this.General.launcherWindowWidth = mergeSettings.General.launcherWindowWidth;
        this.General.launcherWindowHeight = mergeSettings.General.launcherWindowHeight;
        return this;
    }

    getActiveModuleSummaries() {
        let am = [];
        for (const [catKey, catValue] of Object.entries(this)) {
            if ((catKey != 'General') && ('moduleName' in catValue) && catValue.active) {
                let modSumm = {};
                modSumm.moduleName = catValue.moduleName;
                modSumm.filenames = catValue.filenames;
                am.push(modSumm);
            }
        }
        // console.log(`settings: getActiveModuleSummaries: returning`, am);
        return am;
    }
};

exports.createGeneralSettingsObject = () => {
    return new GeneralSettings();
}
