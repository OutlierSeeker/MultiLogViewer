const fs = require('fs');
const path = require('path');
const ini = require('ini');

const homePath = process.env.APPDATA || process.env.HOME + "/.local/share";
const lvPath = path.join(homePath, 'MultiLogViewer');
const iniFilePath = path.join(lvPath, 'MultiLogViewer.ini');

// console.log('iniops: lvPath:', lvPath, `iniPath: ${iniFilePath}`);


const checkAndCreateValidINIFolder = () => {
    // try {
    //     fs.accessSync(lvPath, fs.constants.W_OK);
    //     console.log("access to", lvPath, "works");
    // } catch (err) {
    //     console.log("can't write to folder", lvPath);
    try {
        if (!fs.existsSync(lvPath)) {
            fs.mkdirSync(lvPath);
            console.log("'", lvPath, "' created.");
        }
    } catch (err) {
        console.error(err);
        return false;
    }
    // }
    // console.log("returning isValidIniFolder == true");
    return true;
}


const checkIniFileExists = () => {
    try {
        fs.accessSync(iniFilePath, fs.constants.W_OK);
        // console.log("iniOps: checkIniFileExists: access to", lvPath, "works");
        return true;
    } catch (err) {
        console.log("iniOps: checkIniFileExists: can't write to folder", lvPath);
        return false;
    }
}


exports.writeGlobalINIConfig = async function (globalConfig) {
    let goWriteBool = false;
    if (checkIniFileExists() === true) {
        // TODO write to ini file
        goWriteBool = true;
        // console.log("ini exists");
    }
    else {
        goWriteBool = checkAndCreateValidINIFolder();
    }
    if (goWriteBool) {

        try {
            /* TODO write ini */
            // fs.writeFileSync(iniFilePath, ";my content");
            // console.log(`iniOps: writing ${globalConfig}`);
            fs.writeFileSync(iniFilePath, ini.stringify(globalConfig));
            // console.log("file written");
        } catch (err) {
            console.error(err)
        }
    }
}


exports.getGlobalINIConfig = function () {
    if (checkIniFileExists()) {
        return ini.parse(fs.readFileSync(iniFilePath, 'utf-8'));
    }
    else {
        return {};
    }
}