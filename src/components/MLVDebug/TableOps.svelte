<script>
    import {
        numberOfRowsToDisplay,
        tableData,
        // selectedNumberOfRowsToDisplay,
        filteredTableData,
        currentShownTableData,
        currentPage,
        // currentTableIndex,
        pageButtonLabels,
        searchString,
    } from "./debugstores";
    import { searchInputDelay, numberOfPaginationButtonsOnTheSide } from "./../../js/stores";
    // import { wastedTimeVar } from "./MLVDebug/debugstores";

    // export var wastedTime = 0;
    // export function changeNumber() {
    //     console.log("changing number");
    //     wastedTime = 50;
    //     $wastedTimeVar = 25;
    //     return wastedTime;
    // }

    let maxPages = 0;
    const updateMaxPages = () => {
        let oldmax = maxPages;
        maxPages = Math.ceil($filteredTableData.length / $numberOfRowsToDisplay);
        // console.log(
        //     "updateMaxPages: from ",
        //     oldmax,
        //     " to ",
        //     maxPages,
        //     `fD.l: ${$filteredTableData.length}, #rowsToDisplay: ${$numberOfRowsToDisplay}`
        // );
    };

    // $: maxPages = Math.ceil($currentShownTableData.length / $numberOfRowsToDisplay);
    $: $filteredTableData, updateMaxPages();
    // let $numberOfRowsToDisplay;
    $: $numberOfRowsToDisplay, updateMaxPages();
    let currentTableIndex;
    $: currentTableIndex = ($currentPage - 1) * $numberOfRowsToDisplay;

    function getTableIndex() {
        // console.log(`getTableIndex(): curPage: ${$currentPage}, sel#Rows: ${$selectedNumberOfRowsToDisplay}`);
        return ($currentPage - 1) * $numberOfRowsToDisplay;
    }

    export function updateShownTable(param) {
        console.log(
            "updateShownTable: tdl:",
            $tableData.length,
            "filteredDT.l:",
            $filteredTableData.length,
            "param:",
            param,
            "$numberOfRowsToDisplay:",
            $numberOfRowsToDisplay
        );
        /*BUG FOR NOW */
        // $filteredTableData = $tableData;
        // $currentShownTableData = $tableData;

        let npbl = [];

        if ($filteredTableData.length < $numberOfRowsToDisplay) {
            $currentShownTableData = $filteredTableData;
            npbl.push(1);
            $pageButtonLabels = npbl;
            $currentPage = 1;
            currentTableIndex = 0;
            // maxPages = 1;
            return;
        }

        // let maxPages = Math.ceil($filteredTableData.length / $numberOfRowsToDisplay);
        updateMaxPages();
        if (param == "<<") {
            $currentPage = 1;
        } else if (param == ">>") {
            $currentPage = maxPages;
        } else {
            $currentPage = Math.min(param, maxPages);
        }
        currentTableIndex = getTableIndex();
        npbl.push($currentPage);

        /* Update table: */
        // console.log(
        //     "updateShownTable: $currentPage:",
        //     $currentPage,
        //     "currentTableIndex:",
        //     currentTableIndex,
        //     "maxPages:",
        //     maxPages,
        //     "tableData.l:",
        //     $tableData.length,
        //     "curTable.l:",
        //     $filteredTableData.length,
        //     "shownTable.l:",
        //     $currentShownTableData.length
        // );
        $currentShownTableData = [];
        // let startIndex = ($currentPage - 1) * $numberOfRowsToDisplay;

        let numberOfShownRows;
        if ($currentPage == maxPages) {
            numberOfShownRows = $filteredTableData.length - (maxPages - 1) * $numberOfRowsToDisplay;
        } else {
            numberOfShownRows = $numberOfRowsToDisplay;
        }
        for (let i = 0; i < numberOfShownRows; i++) {
            $currentShownTableData.push($filteredTableData[($currentPage - 1) * $numberOfRowsToDisplay + i]);
        }
        // console.log(
        //     "tableData.l:",
        //     $tableData.length,
        //     "curTable.l:",
        //     $filteredTableData.length,
        //     "shownTable.l:",
        //     $currentShownTableData.length,
        //     "$currentPage:",
        //     $currentPage,
        //     "currentTableIndex:",
        //     currentTableIndex,
        //     "maxPages:",
        //     maxPages
        // );
        if (maxPages < $numberOfPaginationButtonsOnTheSide * 2 + 1) {
            npbl = [];
            for (let i = 1; i <= maxPages; i++) {
                npbl.push(i);
                $pageButtonLabels = npbl;
                // console.log($pageButtonLabels);
                // console.log("returning");
            }
            return;
        }

        /* Determine how many buttons on either side: */
        let possibleLeft = currentTableIndex / $numberOfRowsToDisplay;
        let rowsAfterCurrentPage = $filteredTableData.length - $numberOfRowsToDisplay * $currentPage;
        // console.log(
        //     "dR.l:",
        //     $filteredTableData.length,
        //     "nTR:",
        //     $numberOfRowsToDisplay,
        //     "cP:",
        //     $currentPage,
        //     "rAfterCP:",
        //     rowsAfterCurrentPage
        // );
        let possibleRight = 0;
        if (rowsAfterCurrentPage > 0) {
            possibleRight = Math.ceil(rowsAfterCurrentPage / $numberOfRowsToDisplay);
            // console.log("pR:", possibleRight);
        }
        // let possibleRight = ($numberOfRowsToDisplay * ($currentPage + 1));
        let numPagesLeft = possibleLeft <= $numberOfPaginationButtonsOnTheSide ? possibleLeft : -1;
        let numPagesRight = possibleRight <= $numberOfPaginationButtonsOnTheSide ? possibleRight : -1;
        // console.log(
        //     "posLeft:",
        //     possibleLeft,
        //     "posRight:",
        //     possibleRight,
        //     "numPLeft:",
        //     numPagesLeft,
        //     "numPRight:",
        //     numPagesRight
        // );
        if (numPagesLeft == -1 && numPagesRight == -1) {
            numPagesLeft = $numberOfPaginationButtonsOnTheSide;
            numPagesRight = $numberOfPaginationButtonsOnTheSide;
        } else if (numPagesLeft == -1) {
            numPagesLeft = $numberOfPaginationButtonsOnTheSide * 2 - numPagesRight;
        } else if (numPagesRight == -1) {
            numPagesRight = $numberOfPaginationButtonsOnTheSide * 2 - numPagesLeft;
        }

        // console.log(
        //     "posLeft:",
        //     possibleLeft,
        //     "posRight:",
        //     possibleRight,
        //     "numPLeft:",
        //     numPagesLeft,
        //     "numPRight:",
        //     numPagesRight
        // );

        // console.log("nPos:", currentTableIndex, "npl:", numPagesLeft);
        if (numPagesLeft > 0) {
            let goleft = $currentPage - 1;
            for (let i = 0; i < numPagesLeft - 1; i++) {
                // console.log("goloeft:", goleft, "i:", i);
                npbl.unshift(goleft--);
            }
            // last page left; check if '<<':
            if (goleft == 1) {
                npbl.unshift(1);
            } else {
                npbl.unshift("<<");
            }
        }
        if (numPagesRight > 0) {
            let goright = $currentPage + 1;
            for (let i = 0; i < numPagesRight - 1; i++) {
                // console.log("goright:", goright, "i:", i);
                npbl.push(goright++);
            }
            // last page left; check if '<<':
            if (goright == maxPages) {
                npbl.push(goright);
            } else {
                npbl.push(">>");
            }
        }

        $pageButtonLabels = npbl;
    }

    export function changeNumberOfTableRows(newRows) {
        // console.log(
        //     "changeNumberOfTableRows: change ntr to: ",
        //     newRows,
        //     "oldNTR:",
        //     $numberOfRowsToDisplay,
        //     "oldIndex:",
        //     currentTableIndex
        // );
        if (newRows === $numberOfRowsToDisplay) {
            return;
        }
        let gotoPage = $currentPage;
        // let b = new == -1;
        // console.log(`changeNumberOfTableRows: b: ${b}`);
        if (newRows == -1) {
            $numberOfRowsToDisplay = $filteredTableData.length;
            gotoPage = 1;
        } else {
            $numberOfRowsToDisplay = newRows;
            updateMaxPages();
            for (let i = 0; i < maxPages; i++) {
                if (
                    currentTableIndex >= i * $numberOfRowsToDisplay &&
                    currentTableIndex <= (i + 1) * $numberOfRowsToDisplay - 1
                ) {
                    gotoPage = i + 1;
                    // console.log("changeNumberOfTableRows: corresponding page found at ", i);
                }
            }
        }
        updateShownTable(gotoPage);
    }

    /* TODO search multiples: { searchstring: [string], column: [columntag or 'all'], exclude: [true/false] } */
    // let searchString = "";
    export function filterTable() {
        console.log("filtering:\t", $searchString);
        let ct = [];
        let lowersearch = $searchString.toLowerCase();
        // console.log("filtering...");
        // ct = [];
        /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries */
        for (let row of $tableData) {
            // let rowAdded = false;
            for (const [key, value] of Object.entries(row)) {
                let stringy = JSON.stringify(value);

                // console.log("filterTable: value:", value, " stringy:", stringy);
                if (stringy.toLowerCase().includes(lowersearch)) {
                    ct.push(row);
                    break;
                    // rowAdded = true;
                }
            }
        }

        // console.log("found", ct.length, " entries.");
        $filteredTableData = ct;
        console.log(`filteredData.l: ${$filteredTableData.length}`);
        updateShownTable(1);
    }

    let searchInputTimeout = undefined;
    export function startSearch() {
        if (typeof searchInputTimeout != "undefined") {
            clearTimeout(searchInputTimeout);
        }
        searchInputTimeout = setTimeout(() => {
            filterTable();
        }, $searchInputDelay);
    }
</script>

<!-- 
{#each $pageButtonLabels as label}
    <button class="paginationButton {label === $currentPage ? 'selected' : ''}" on:click={updateShownTable(label)}
        >{label}</button>
{/each} -->

<!-- <p>someNumber: {someNumber}</p> -->
