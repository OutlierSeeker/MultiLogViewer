import { writable, derived } from 'svelte/store';
import { isDarkMode } from "../../js/stores";

/* Need separate entries because Svelte doesn't trigger correctly otherwise */
export const kinCompareData = writable({});
export const filteredCompareData = writable([]);
export const shownCompareData = writable({ table: [], pagination: [], currentPage: 1 });
export const numberOfRowsToDisplay = writable(10);
// export const currentNumberOfRowsToDisplay = writable(10);
export const searchString = writable("");

export const readRows = derived(kinCompareData, $kinCompareData => {
    if ($kinCompareData.readRows) {
        return $kinCompareData.readRows;
    }
    else { return -1; }
}, -1);

/* filterCodes:
    0: including
    1: excluding
    2: greater than / n.a.
    3: less than / n.a.
    4: equal
    5: not equal
    6: equal or greater
    7: equal or less
*/