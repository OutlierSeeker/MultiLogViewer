<script>
    import { searchInputDelay, numberOfPaginationButtonsOnTheSide, data } from "../../js/stores";
    // import { compareTableObject } from "../../KinCompare./../KinCompare/kcstores";

    // let maxPages = 0;
    // const updateMaxPages = () => {
    //     maxPages = Math.ceil($compareTableObject.filteredTable.length / $compareTableObject.numberOfRowsToDisplay);
    //     // console.log(
    //     //     "updateMaxPages: from ",
    //     //     oldmax,
    //     //     " to ",
    //     //     maxPages,
    //     //     `fD.l: ${$filteredTableData.length}, #rowsToDisplay: ${numberOfRowsToDisplay}`
    //     // );
    // };

    // $: $compareTableObject, updateTable();

    export const codeArray = [
        { code: 0, display: "Including" },
        { code: 1, display: "Excluding" },
        { code: 2, display: "Greater" },
        { code: 3, display: "Less" },
        { code: 4, display: "Equal" },
        { code: 5, display: "Not Equal" },
        { code: 6, display: "Equal or Greater" },
        { code: 7, display: "Equal or Less" },
    ];

    export const getFilterCodeArray = (isANumber) => {
        if (isANumber) {
            return codeArray;
        } else {
            return codeArray.slice(0, 2);
        }
    };

    const getTableIndex = () => {};

    // export const updateShownTable = (tableObject, param) => {
    export const updateShownTable = (filteredTable, goToPage = 1, numberOfRowsToDisplay = 10) => {
        console.log(
            "updateShownTable: START: filteredTable.l",
            filteredTable.length,
            ", goToPage:",
            goToPage,
            ", no. rows: ",
            numberOfRowsToDisplay,
            ` (${typeof numberOfRowsToDisplay})`
        );
        // if (tableObject?.filteredTable) {
        let shownObject = {};
        shownObject.table = [];
        shownObject.pagination = [];

        if (filteredTable.length < numberOfRowsToDisplay || numberOfRowsToDisplay == -1) {
            console.log("updateShownTable: show all (-1)");

            shownObject.table = filteredTable;
            shownObject.pagination.push(1);
            shownObject.currentPage = 1;
            return shownObject;
        }

        let maxPages = Math.ceil(filteredTable.length / numberOfRowsToDisplay);
        if (goToPage == "<<") {
            shownObject.currentPage = 1;
        } else if (goToPage == ">>") {
            shownObject.currentPage = maxPages;
        } else {
            shownObject.currentPage = Math.min(goToPage, maxPages); // TODO check if neccessary
        }

        let numberOfShownRows;
        if (shownObject.currentPage === maxPages) {
            numberOfShownRows = filteredTable.length - (maxPages - 1) * numberOfRowsToDisplay;
        } else {
            numberOfShownRows = numberOfRowsToDisplay;
        }

        let currentTableIndex = (shownObject.currentPage - 1) * numberOfRowsToDisplay;
        shownObject.table = [];
        for (let i = 0; i < numberOfShownRows; i++) {
            shownObject.table.push(filteredTable[currentTableIndex + i]);
        }

        if (maxPages < $numberOfPaginationButtonsOnTheSide * 2 + 1) {
            for (let i = 1; i <= maxPages; i++) {
                shownObject.pagination.push(i);
            }
            return shownObject;
        } else {
            shownObject.pagination.push(shownObject.currentPage);
        }

        let possibleLeft = currentTableIndex / numberOfRowsToDisplay;
        let rowsAfterCurrentPage = filteredTable.length - numberOfRowsToDisplay * shownObject.currentPage;
        let possibleRight = rowsAfterCurrentPage === 0 ? 0 : Math.ceil(rowsAfterCurrentPage / numberOfRowsToDisplay);
        let numPagesLeft = possibleLeft <= $numberOfPaginationButtonsOnTheSide ? possibleLeft : -1;
        let numPagesRight = possibleRight <= $numberOfPaginationButtonsOnTheSide ? possibleRight : -1;

        if (numPagesLeft === -1 && numPagesRight === -1) {
            numPagesLeft = $numberOfPaginationButtonsOnTheSide;
            numPagesRight = $numberOfPaginationButtonsOnTheSide;
        } else if (numPagesLeft === -1) {
            numPagesLeft = $numberOfPaginationButtonsOnTheSide * 2 - numPagesRight;
        } else if (numPagesRight === -1) {
            numPagesRight = $numberOfPaginationButtonsOnTheSide * 2 - numPagesLeft;
        }

        if (numPagesLeft > 0) {
            let goLeft = shownObject.currentPage - 1;
            for (let i = 0; i < numPagesLeft - 1; i++) {
                shownObject.pagination.unshift(goLeft--);
            }
            if (goLeft === 1) {
                shownObject.pagination.unshift(1);
            } else {
                shownObject.pagination.unshift("<<");
            }
        }
        if (numPagesRight > 0) {
            let goRight = shownObject.currentPage + 1;
            for (let i = 0; i < numPagesRight - 1; i++) {
                shownObject.pagination.push(goRight++);
            }
            if (goRight === maxPages) {
                shownObject.pagination.push(goRight);
            } else {
                shownObject.pagination.push(">>");
            }
        }

        // console.log(`updateShownTable: posLeft: ${possibleLeft}, posRight: ${possibleRight}, numPLeft: ${numPagesLeft}, 
        //     numPRight: ${numPagesRight}, shownObject.pagination: [${shownObject.pagination}], currentPage: ${shownObject.currentPage}`);

        // console.log(`updateShownTable: posLeft: ${possibleLeft}, posRight: ${possibleRight}, numPLeft: ${numPagesLeft}, 
        //     numPRight: ${numPagesRight}, shownObject.pagination: [${shownObject.pagination}], currentPage: ${shownObject.currentPage}`);
        // }
        if (shownObject != undefined && shownObject.hasOwnProperty("currentPage")) {
            console.log("updateShownTable: END", `currentPage: ( ${shownObject.currentPage} )`, shownObject);
        }
        return shownObject;
    };

    export const filterTable = (tableObject, currentFilter) => {
        console.log("filterTable: tableObject:", tableObject, "\n currentFilter:", currentFilter);
        let ft = [];
        if (tableObject?.baseTable) {
            ft = tableObject.baseTable;
            // console.log("filterTable: tableObject:", tableObject, "\n currentFilter:", currentFilter);

            let localFilters = [...tableObject.savedFilters];
            // console.log("filterTable: savedFilters to localFilter: ", localFilters);
            if (currentFilter?.value?.length > 0) {
                console.log("filterTable: copied currentFilter: ", { ...currentFilter });
                localFilters.push({ ...currentFilter });
            }
            // console.log("filterTable: localFilters:", localFilters);
            if (localFilters.length > 0) {
                for (let filter of localFilters) {
                    // console.log(`filterTable: got filters: ${filter.key}, ${filter.value}, ${filter.code}`);
                    let ct = [];
                    let parsedFilterValue;
                    if (filter.code < 2) {
                        parsedFilterValue = isNaN(filter.value)
                            ? filter.value.toLowerCase()
                            : filter.value.toString().toLowerCase();
                    } else {
                        parsedFilterValue = Number(filter.value);
                        // if (isNaN(parsedFilterValue)) {
                        //     console.log("ERROR:", parsedFilterValue, " is not a number!");
                        //     return [];
                        // }
                    }
                    // if (filter.code < 2) {
                    //     parsedFilterValue = JSON.stringify(filter.value).toLowerCase();
                    // } else {
                    //     parsedFilterValue = filter.value;
                    // }
                    // console.log(`filterTable: parsedFilterValue: ${parsedFilterValue} (${typeof parsedFilterValue})`);
                    for (let row of ft) {
                        if (filter.key.length === 1 && filter.key[0] == "filterAll") {
                            let addRow = filter.code === 0 ? false : true;
                            for (const value of Object.values(row)) {
                                const parsedKeyValue = isNaN(value)
                                    ? value.toLowerCase()
                                    : value.toString().toLowerCase();
                                // console.log(
                                //     `filterTable: value: ${JSON.stringify(
                                //         value
                                //     ).toLowerCase()} parsedFilterValue: ${parsedKeyValue} (${typeof parsedKeyValue})`
                                // );

                                if (filter.code === 0) {
                                    // include
                                    if (parsedKeyValue.indexOf(parsedFilterValue) > -1) {
                                        // console.log(
                                        //     `filterTable: pushing: ${row} for f.v: ${filter.value} and parsedFilterValue: ${parsedFilterValue}`
                                        // );
                                        addRow = true;
                                        break;
                                    }
                                } else if (filter.code === 1) {
                                    if (parsedKeyValue.indexOf(parsedFilterValue) > -1) {
                                        addRow = false;
                                        break;
                                    }
                                }
                                // TODO: add cases 2 - 4
                            }
                            if (addRow) {
                                ct.push(row);
                            }
                        } else {
                            for (const filterKey of filter.key) {
                                // console.log(`filterTable: filterKey: ${filterKey}`);
                                if (row.hasOwnProperty(filterKey)) {
                                    // console.log(`filterTable: row has filterkey: ${filterKey}`);
                                    if (filter.code < 2) {
                                        const parsedKeyValue = isNaN(row[filterKey])
                                            ? row[filterKey].toLowerCase()
                                            : row[filterKey].toString().toLowerCase();
                                        if (
                                            (filter.code === 0 && parsedKeyValue.indexOf(parsedFilterValue) > -1) ||
                                            (filter.code === 1 && parsedKeyValue.indexOf(parsedFilterValue) === -1)
                                        ) {
                                            ct.push(row);
                                        }
                                    } else {
                                        switch (filter.code) {
                                            case 2:
                                                if (row[filterKey] > filter.value) {
                                                    ct.push(row);
                                                }
                                                break;
                                            case 3:
                                                if (row[filterKey] < filter.value) {
                                                    ct.push(row);
                                                }
                                                break;
                                            case 4:
                                                if (row[filterKey] == filter.value) {
                                                    ct.push(row);
                                                }
                                                break;
                                            case 5:
                                                if (row[filterKey] != filter.value) {
                                                    ct.push(row);
                                                }
                                                break;
                                            case 6:
                                                if (row[filterKey] >= filter.value) {
                                                    ct.push(row);
                                                }
                                                break;
                                            case 7:
                                                if (row[filterKey] <= filter.value) {
                                                    ct.push(row);
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // console.log(`filterTable: ct.l: ${ct.length}`);
                    ft = ct;
                }
            }
            // console.log("TableOps: filterTable:", tableObject);
            // updateShownTable(tableObject, 1);
        } else {
            console.log("filterTable: NO base table for", tableObject);
        }
        // console.log("filterTable: filteredTable.l: ", ft.length);
        // console.log("filterTable: filteredTable.l: ", ft);
        // return updateShownTable(tableObject, 1);
        return ft;
    };

    // let searchInputTimeout = undefined;
    // export const startSearch = (tableObject, currentFilter) => {
    //     if (typeof searchInputTimeout != "undefined") {
    //         clearTimeout(searchInputTimeout);
    //     }
    //     searchInputTimeout = setTimeout(() => {
    //         filterTable(tableObject, currentFilter);
    //     }, $searchInputDelay);
    // };
</script>

<style lang="scss">
    :global(.paginationButton) {
        margin: 2px 5px 2px 0px;
    }
</style>
