import { writable, derived } from 'svelte/store';

export const fileData = writable({});
export const loadedModules = derived(fileData, $fileData => {
    if ($fileData.activeMods) {
        return $fileData.activeMods.map(e => e.module);
    }
    else { return []; }
});
// export const loadedModules = writable([]);
// export const loadedModules = derived(
//     generalSettings,
//     generalSettings => {
//         let modules = [];
//         for (const [key, value] of Object.entries(generalSettings)) {
//             if ((key != 'General') && (generalSettings[key].hasOwnProperty('moduleName'))) {
//                 modules.push(value.moduleName);
//             }
//         }
//         return modules;
//     }
// );


export const generalSettings = writable({});

/** Start of permanent 'General' Settings: */
export const numberOfLastDirectories = writable(5);
export const lastDirectories = writable([]);
export const logModules = writable([]);
export const isDarkMode = writable(false);
export const searchInputDelay = writable(500);
export const defaultNumberOfTableRows = writable(50);
export const rowNumberOptions = writable([5, 15, 30, 40, 100, 250, 500, 1000, -1]); // TODO add option to fit # rows to screen size
export const numberOfPaginationButtonsOnTheSide = writable(2);
/** End of 'General' Settings */


/** possible values: overview, mlvdebug, mlvtest, mlvfunctimes, kincompare */
export const selectedSidebarEntry = writable('kincompare');



export const appColors = derived(isDarkMode, $isDarkMode => {
    if ($isDarkMode) {
        return {
            mainFont: '#e9e9e9', mainFontHover: '#c9c9c9',
        };
    }
    else {
        return {
            mainFont: '#010101', mainFontHover: '#414141',
        };
    }
});

export const data = writable({});