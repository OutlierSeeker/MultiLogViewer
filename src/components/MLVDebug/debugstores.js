import { writable } from 'svelte/store';


/* Settings: */
// TODO move to settings with IPC, make options per folder, module
// export const selectedNumberOfRowsToDisplay = writable(10);
export const numberOfRowsToDisplay = writable(10);
export const displayLevelColors = writable('levelColumn'); //  TODO implement line | levelColumn | none
export const tableColors = writable([
    { level: 'TRACE', colorLight: '#ffffff', backgroundColorLight: '#0000ff', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // blue
    { level: 'INFO', colorLight: '#000000', backgroundColorLight: '#FF4DE7', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },   // purple
    { level: 'DEBUG', colorLight: '#000000', backgroundColorLight: '#55F7DC', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // cyan
    { level: 'PASS', colorLight: '#000000', backgroundColorLight: '#25E817', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // green
    { level: 'WARNING', colorLight: '#000000', backgroundColorLight: '#ffff00', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', }, // yellow
    { level: 'ERROR', colorLight: '#000000', backgroundColorLight: '#FF8822', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },  // orange
    { level: 'FATAL', colorLight: '#ffffff', backgroundColorLight: '#ff0000', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', }, // red
    { level: 'UNKNOWN', colorLight: '#000000', backgroundColorLight: '#fafafa', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', },
]);
// export const defaultTableColor = writable({ level: 'UNKNOWN', colorLight: '#000000', backgroundColorLight: '#fafafa', hoverBackgroundColorLight: '#898989', colorDark: '#e8e8e8', backgroundColorDark: '#080808', hoverBackgroundColorDark: '#181818', });

/* One time: */
export const filename = writable('filename');
// export const columnMap = writable([]);

/* Send full data: */
export const finishedReading = writable(false);
export const readRows = writable(0);
export const invalidRows = writable(0);
export const sortedLevelCounts = writable([]);
export const levelCount = writable([]);
export const classCount = writable([]);
export const functionCount = writable([]);

/* Append data: */
export const tableData = writable([]);
/* tableColumns: 1: time, 2: level, 3: class, 4: function, 5: comment */
export const tableColumns = writable([1, 2, 3, 4, 5]);


/* Table: */
export const filteredTableData = writable([]);
export const currentShownTableData = writable([]);
export const currentPage = writable(1);
// export const currentNumberofRowsToDisplay = writable(1);
// export const currentTableIndex = writable(0);
export const pageButtonLabels = writable([]);
// export const searchInputTimeout = writable(null);
export const searchString = writable("");


/* Start of Statistics */
export const displayTop = writable(10);
/* End of Statistics */


// const { writable } = require('svelte/store');
// export const hasDebugDataChanged = writable(true);
// exports.hasDebugDataChanged = writable(false);

// export const filename = writable({ filename: 'herbert' });
// exports.filename = writable({ filename: 'herbert' });






