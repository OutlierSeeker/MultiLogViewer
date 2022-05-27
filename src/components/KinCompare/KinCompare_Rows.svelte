<script>
    import { onMount } from "svelte";
    import { kinCompareData, filteredCompareData, shownCompareData, numberOfRowsToDisplay } from "./kcstores";
    import { searchInputDelay, rowNumberOptions } from "../../js/stores";
    import RowEntry from "./KinCompare_RowEntry.svelte";
    import FilterEntry from "./KinCompare_FilterEntry.svelte";
    import TableOps from "../Common/TableOps.svelte";
    let tableops;
    /* TODO load and apply filters if present */

    let currentAvailableFilterIndex = 0;
    let currentFilter = { key: [], value: "", code: 0 };
    let currentCodeArray = [{ code: 0, display: "Including" }];
    let isValidCurrentFilter = true;

    let initializeRows = () => {};
    let applyFilters = () => {};
    let setShownRows = () => {};
    // let updateTable = (tableObject, param) => {};
    $: $kinCompareData, initializeRows();
    // $: $kinCompareData.rowTableObject?.filteredTable, setShownRows();
    $: $filteredCompareData, setShownRows();

    export const validateNumberInput = () => {
        if (
            $kinCompareData.rowTableObject.availableFilters[currentAvailableFilterIndex].isNumber &&
            isNaN(Number(currentFilter.value))
        ) {
            isValidCurrentFilter = false;
            return false;
        } else {
            isValidCurrentFilter = true;
            return true;
        }
    };

    const addFilter = () => {
        if (currentFilter.value.length > 0 && validateNumberInput) {
            $kinCompareData.rowTableObject.savedFilters.push({ ...currentFilter });
        }
        currentFilter = { key: $kinCompareData.rowTableObject.availableFilters[0].key, value: "", code: 0 };
        applyFilters();
        // console.log("addFilter: ", $kinCompareData.rowTableObject.savedFilters);
    };

    const deleteFilter = (event) => {
        // console.log("deleteFilter: savedFilters:", $kinCompareData.rowTableObject.savedFilters);
        $kinCompareData.rowTableObject.savedFilters.splice(event.detail.i, 1);
        applyFilters();
        // console.log("deleteFilter: savedFilters:", $kinCompareData.rowTableObject.savedFilters);
    };

    let searchInputTimeout = undefined;
    const startSearch = () => {
        // console.log("local startSearch...START with ", currentFilter.value, ": ", $kinCompareData.rowTableObject);
        if (typeof searchInputTimeout != "undefined") {
            clearTimeout(searchInputTimeout);
        }
        if (validateNumberInput()) {
            isValidCurrentFilter = true;
            console.log(
                "local startSearch: isValidCurrentFilter:",
                isValidCurrentFilter,
                " , currentValue:",
                currentFilter.value
            );
            searchInputTimeout = setTimeout(() => {
                // $kinCompareData.rowTableObject = tableops.filterTable($kinCompareData.rowTableObject, currentFilter);
                applyFilters();
            }, $searchInputDelay);
        }

        // console.log("local startSearch...END", $kinCompareData.rowTableObject);
    };

    const selectChange = () => {
        // console.log(
        //     "selectChange: currentFilter:",
        //     currentFilter,
        //     ", currentAvailableFilterIndex:",
        //     currentAvailableFilterIndex
        // );
        currentFilter.key = $kinCompareData.rowTableObject.availableFilters[currentAvailableFilterIndex].key;
        currentCodeArray = tableops.getFilterCodeArray(
            $kinCompareData.rowTableObject.availableFilters[currentAvailableFilterIndex].isNumber
        );
        if (currentCodeArray.length < currentFilter.code) {
            currentFilter.code = 0;
        }
        if (currentFilter.value.length > 0) {
            validateNumberInput();
            if (isValidCurrentFilter) {
                applyFilters();
            }
        }
    };

    let newRowNumber = -1;
    const changeNumberOfTableRows = () => {
        // console.log("changeNumberOfTableRows: START: new RowNumber:", newRowNumber);
        if (newRowNumber != $numberOfRowsToDisplay) {
            // let goToPage = $shownCompareData.currentPage;
            if (newRowNumber == -1) {
                console.log("changeNumberOfTableRows: START: -1");
                $shownCompareData.currentPage = 1;
            } else {
                console.log("changeNumberOfTableRows: START: else");
                let currentTableIndex = ($shownCompareData.currentPage - 1) * $numberOfRowsToDisplay;
                let maxPages = Math.ceil($filteredCompareData.length / newRowNumber);
                for (let i = 0; i < maxPages; i++) {
                    console.log(`changeNumberOfTableRows: newRowNumber: ${newRowNumber}, currentTableIndex: ${currentTableIndex},
                    maxPages: ${maxPages}, min: ${currentTableIndex >= i * newRowNumber}, max: ${
                        currentTableIndex <= (i + 1) * newRowNumber - 1
                    }`);
                    if (currentTableIndex >= i * newRowNumber && currentTableIndex <= (i + 1) * newRowNumber - 1) {
                        $shownCompareData.currentPage = i + 1;
                        // goToPage = i + 1;
                        console.log("changeNumberOfTableRows: corresponding page found at ", i);
                        break;
                    }
                }
            }
            $numberOfRowsToDisplay = newRowNumber;
            setShownRows();
        }
    };

    onMount(async () => {
        initializeRows = function () {
            // console.log("initializeRows: ...");
            if ($kinCompareData?.rowTableObject?.availableFilters) {
                // console.log("initializeRows: availableFilters:", $kinCompareData.rowTableObject.availableFilters);
                // currentFilter = { key: $kinCompareData.rowTableObject.availableFilters[0].key, value: "", code: 0 };
                currentAvailableFilterIndex = 0;
                selectChange();
                applyFilters();
            }
        };
        applyFilters = function () {
            // console.log("applyFilters: ...");
            if ($kinCompareData?.rowTableObject) {
                // TODO  should not be needed anymore
                // console.log("applyFilters: rowTableObject", $kinCompareData.rowTableObject);
                $shownCompareData.currentPage = 1;
                $filteredCompareData = tableops.filterTable($kinCompareData.rowTableObject, currentFilter);
                // console.log("applyFilters: filteredCompareData", $filteredCompareData);
            }
        };
        setShownRows = function () {
            // console.log("setShownRows: START: filtererdCR:", $kinCompareData.rowTableObject);
            // $shownCompareRows = tableops.updateShownTable($filteredCompareRows, 1);
            // $kinCompareData.rowTableObject.filteredTable = $filteredCompareRows;
            $shownCompareData = tableops.updateShownTable(
                $filteredCompareData,
                $shownCompareData.currentPage,
                $numberOfRowsToDisplay
            );
            // console.log("setShownRows: END: shownCompareData.l:", $shownCompareData.table.length);
        };
    });
</script>

<TableOps bind:this={tableops} />

<div class="filterWrap">
    Filter:
    {#if $kinCompareData?.rowTableObject?.availableFilters}
        <select bind:value={currentAvailableFilterIndex} on:change={selectChange}>
            {#each $kinCompareData.rowTableObject.availableFilters as filter, i}
                <option value={i}>{filter.display}</option>
            {/each}
        </select>
    {/if}
    <select bind:value={currentFilter.code} on:change={selectChange}>
        {#each currentCodeArray as entry}
            <option value={entry.code}>{entry.display}</option>
        {/each}
    </select>
    <input
        type="text"
        bind:value={currentFilter.value}
        on:keyup={startSearch}
        id="filterInput"
        style={!isValidCurrentFilter ? "background-color: #ff0000" : ""} />
    <button on:click={addFilter} disabled={currentFilter.value.length === 0}>Add Filter</button>

    {#if $kinCompareData?.rowTableObject?.savedFilters?.length > 0}
        <div>
            Active Filters:
            {#each $kinCompareData.rowTableObject.savedFilters as filter, i}
                <FilterEntry
                    index={i}
                    keyDisplay={$kinCompareData.rowTableObject.availableFilters.filter((e) => e.key == filter.key)[0]
                        .display}
                    codeDisplay={tableops.codeArray[filter.code].display}
                    value={filter.value}
                    on:deleteFilter={deleteFilter} />
            {/each}
        </div>
    {/if}
</div>

<div class="paginationWrap">
    {#if $shownCompareData?.pagination}
        {#each $shownCompareData.pagination as label}
            <button
                class="paginationButton {label == $shownCompareData.currentPage ? 'selected' : ''}"
                disabled={label === $shownCompareData.currentPage}
                on:click={() => {
                    $shownCompareData = tableops.updateShownTable($filteredCompareData, label, $numberOfRowsToDisplay);
                }}>{label}</button>
        {/each}
    {/if}

    <select bind:value={newRowNumber} on:change={changeNumberOfTableRows}>
        {#each $rowNumberOptions as rno}
            {#if rno != -1}
                <option value={rno} selected={rno == $numberOfRowsToDisplay}>{rno}</option>
            {:else}
                <option value={rno} selected={rno == $numberOfRowsToDisplay}>All {rno}</option>
            {/if}
        {/each}
    </select>

    {#if $shownCompareData?.table?.length > 0}
        <span class="rowStatWrap">
            Showing
            {#if $numberOfRowsToDisplay == -1 || $numberOfRowsToDisplay > $shownCompareData?.table?.length}
                all
            {:else}
                {($shownCompareData.currentPage - 1) * $numberOfRowsToDisplay + 1} -
                {$shownCompareData.currentPage * $numberOfRowsToDisplay}
            {/if}
            {$shownCompareData.table.length} entries
        </span>
    {/if}
</div>

<table>
    <tr>
        <th>Name1</th>
        <th>ID1</th>
        <th>Name2</th>
        <th>ID2</th>
        <th class="center">Result</th>
        <th class="center">Method</th>
        <th class="center">Depth</th>
    </tr>
    {#each $shownCompareData.table as entry}
        <RowEntry {...entry} />
    {/each}
</table>

<style lang="scss">
    th {
        padding: 0px 5px;
    }
    .center {
        text-align: center;
    }

    .filterWrap {
        margin: 5px 0px 15px 5px;
    }

    .rowStatWrap {
        margin: 0px 5px 0px 10px;
    }
</style>
