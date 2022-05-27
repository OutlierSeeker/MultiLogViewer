import { writable, derived } from 'svelte/store';
import { isDarkMode } from "../../js/stores";

export const functionTimes = writable({});
export const filteredFunctionTimesData = writable([]);
export const bookmarkedFunctions = writable([]);    // TODO make bookmarks permanent
export const searchString = writable("");


export const unitMethod = writable('functionMin');  // 'globalMin', 'functionMin', 'cell', 'set'
export const units = writable(['h', 'min', 's', 'ms', 'mus', 'ns']);
export const setUnit = writable('s');
export const timeDecimals = writable(3);
export const globalMinFormat = derived(functionTimes, functionTimes => {
    let min = Number.MAX_VALUE;
    if (functionTimes.data) {
        // console.log("functimestore:", functionTimes.data);
        functionTimes.data.forEach(functionEntry => {
            if (functionEntry.firstMin > 0 && functionEntry.firstMin < min) {
                min = functionEntry.firstMin;
            }
            if (functionEntry.overallMin > 0 && functionEntry.overallMin < min) {
                min = functionEntry.overallMin;
            }
            if (functionEntry.lastMin > 0 && functionEntry.lastMin < min) {
                min = functionEntry.lastMin;
            }
        });
    }
    let mf = '';
    if (min < 1000) {
        mf = "ns";
    } else if (min < 1000000) {
        mf = "µs";
    } else if (min < 1000000000) {
        mf = "ms";
    } else if (min < 60000000000) {
        mf = "s";
    } else if (min < 3600000000000000) {
        mf = "min";
    } else {
        mf = "h";
    }
    return mf;
});

export const timeColors = writable([
    { order: 'first', type: 'min', backgroundColor: '#7ade6c', dark: false, },
    { order: 'first', type: 'average', backgroundColor: '#77a7ef', dark: false, },
    { order: 'first', type: 'max', backgroundColor: '#e6807e', dark: false, },
    { order: 'overall', type: 'min', backgroundColor: '#74be4c', dark: false, },
    { order: 'overall', type: 'average', backgroundColor: '#7188cf', dark: false, },
    { order: 'overall', type: 'max', backgroundColor: '#e0615e', dark: false, },
    { order: 'last', type: 'min', backgroundColor: '#47ab39', dark: false, },
    { order: 'last', type: 'average', backgroundColor: '#5484cc', dark: false, },
    { order: 'last', type: 'max', backgroundColor: '#b35d5b', dark: false, },
    { order: 'first', type: 'min', backgroundColor: '#00dd00', dark: true, },
    { order: 'first', type: 'average', backgroundColor: '#0000dd', dark: true, },
    { order: 'first', type: 'max', backgroundColor: '#dd0000', dark: true, },
    { order: 'overall', type: 'min', backgroundColor: '#00cc00', dark: true, },
    { order: 'overall', type: 'average', backgroundColor: '#0000cc', dark: true, },
    { order: 'overall', type: 'max', backgroundColor: '#cc0000', dark: true, },
    { order: 'last', type: 'min', backgroundColor: '#00bb00', dark: true, },
    { order: 'last', type: 'average', backgroundColor: '#0000bb', dark: true, },
    { order: 'last', type: 'max', backgroundColor: '#bb0000', dark: true, },
]);

/* TODO also consider darkMode in derived.. */
export const currentTimeColors = derived([isDarkMode, timeColors], ([$isDarkMode, $timeColors]) => {
    return $timeColors.filter(e => e.dark == $isDarkMode)
}, []);

export const chartModes = writable([
    { mode: 'byOrder', displayAs: 'by Order' },
    { mode: 'byType', displayAs: 'by Type' }
]);
export const currentChartMode = writable('byOrder');
export const chartLabels = derived(currentChartMode, $currentChartMode => {
    if ($currentChartMode == "byOrder") { return ["First", "Overall", "Last"]; }
    else { return ["Min", "Average", "Max"]; }
}, []);
export const legendLabels = derived(currentChartMode, $currentChartMode => {
    if ($currentChartMode == "byOrder") { return ["Min", "Average", "Max"]; }
    else { return ["First", "Overall", "Last"]; }
}, []);
export const chartBGColors = derived([currentChartMode, currentTimeColors], ([$currentChartMode, $currentTimeColors]) => {
    let bgColors = [];
    if ($currentChartMode == "byOrder") {
        bgColors.push($currentTimeColors.filter((e) => e.type == "min").map((e) => e.backgroundColor));
        bgColors.push($currentTimeColors.filter((e) => e.type == "average").map((e) => e.backgroundColor));
        bgColors.push($currentTimeColors.filter((e) => e.type == "max").map((e) => e.backgroundColor));
    } else {
        bgColors.push($currentTimeColors.filter((e) => e.order == "first").map((e) => e.backgroundColor));
        bgColors.push($currentTimeColors.filter((e) => e.order == "overall").map((e) => e.backgroundColor));
        bgColors.push($currentTimeColors.filter((e) => e.order == "last").map((e) => e.backgroundColor));
    }
    // console.log('chartBG:', bgColors);
    return bgColors;
}, []);
export const chartLegendColors = derived(currentChartMode, $currentChartMode => {
    if ($currentChartMode == "byOrder") { return ["#dddddd", "#aaaaaa", "#777777"]; }
    else { return ["#74be4c", "#7188cf", "#e0615e"]; }
});

export const chartGridColors = derived(isDarkMode, $isDarkMode => { 
    if($isDarkMode) { return '#616161'; }
    else { return '#a1a1a1'; }
});