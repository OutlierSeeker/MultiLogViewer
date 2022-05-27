<script>
    import { searchInputDelay } from "../../js/stores";
    import { functionTimes, filteredFunctionTimesData, searchString } from "./functiontimestores";

    /* TODO search multiples: { searchstring: [string], column: [columntag or 'all'], exclude: [true/false] } */
    // let searchString = "";
    export function filterFunctionTimes() {
        // console.log("filtering:\t", $searchString);
        if ($searchString == "") {
            $filteredFunctionTimesData = $functionTimes.data;
        } else {
            let ct = [];
            let lowersearch = $searchString.toLowerCase();
            // console.log("filtering...");
            // ct = [];
            /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries */
            if ($functionTimes.data) {
                $functionTimes.data.forEach((entry) => {
                    // console.log("filterFunctionTimes: entry:", entry.functionName, " searching:", lowersearch);
                    if (entry.functionName.toLowerCase().indexOf(lowersearch) > -1) {
                        ct.push(entry);
                    }
                });
            }

            // console.log("found", ct.length, " entries.");
            $filteredFunctionTimesData = ct;
            // console.log(`filteredFunctionTimesData.l: ${$filteredFunctionTimesData.length}`);
            // updateShownTable(1);
        }
    }

    let searchInputTimeout = undefined;
    export function startSearch() {
        if (typeof searchInputTimeout != "undefined") {
            clearTimeout(searchInputTimeout);
        }
        searchInputTimeout = setTimeout(() => {
            filterFunctionTimes();
        }, $searchInputDelay);
    }
</script>
