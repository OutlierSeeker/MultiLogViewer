<script>
    // import settings from "../../js/settings"; // disable -> use API
    import {
        generalSettings,
        //     isDarkMode,
        //     searchInputDelay,
        //     searchInputTimeout,
        rowNumberOptions,
        // defaultNumberOfTableRows,
        //     numberOfPaginationButtonsOnTheSide,
    } from "./../../js/stores";
    import {
        filename,
        finishedReading,
        readRows,
        invalidRows,
        sortedLevelCounts,
        levelCount,
        classCount,
        functionCount,
        tableData,
        tableColumns,
        numberOfRowsToDisplay,
        filteredTableData,
        currentShownTableData,
        currentPage,
        pageButtonLabels,
        searchString,
        // tempLength,
    } from "./debugstores";
    // import { numberOfPaginationButtonsOnTheSide } from "./../../js/stores";
    import { onMount } from "svelte";
    import MLVDebug_TableRowItem from "./MLVDebug_TableRowItem.svelte";
    import TableOps from "./TableOps.svelte";
    let tableOps;

    let updateTable = async () => {};
    let changeRowNumber = async () => {};
    $: $readRows, updateTable($currentPage);
    let selectedNumberOfRowsToDisplay = $numberOfRowsToDisplay;
    // console.log("TableView init: nortd: ", $numberOfRowsToDisplay);
    $: selectedNumberOfRowsToDisplay, changeRowNumber(selectedNumberOfRowsToDisplay);
    /*
let searchInputDelay = 500;//set
let searchInputTimeout = null;//set
export let tableData; //debstore
let $selectedNumberOfRowsToDisplay;   //debstore
let newNumberOfTableRows = 25;
let rowNumberOptions = [5, 10, 25, 50, 100, 250, 500, 1000, -1];
let $numberOfPaginationButtonsOnTheSide = 2; // must be at least 2 // stor
let pageButtonLabels;
let currentPage = 1;
let currentTableIndex = (currentPage - 1) * $selectedNumberOfRowsToDisplay;
let currentTable = tableData;
let currentShownTableData = [];
let maxPages = Math.ceil(currentTable.length / $selectedNumberOfRowsToDisplay);
*/

    // let wastedTimeComponent;

    onMount(async () => {
        // console.log("TableView onMount: ftd.l:", $filteredTableData.length);

        changeRowNumber = async function (rowsPerPage) {
            tableOps.changeNumberOfTableRows(rowsPerPage);
        };

        updateTable = async function (param) {
            tableOps.updateShownTable(param);
        };

        if (filteredTableData.length > 0) {
            updateTable(1);
        } else {
            console.log("TableView onMount: No filtered data to display...");
            // TODO display no data message if empty
        }
    });
</script>

<TableOps bind:this={tableOps} />
<!-- 
<p>
    Click below {x}
</p>
<p>
    store: {$wastedTimeVar}
</p>

<button on:click|preventDefault={wastedTimeComponent.changeNumber}>click me</button>

<button on:click={tops.updateShownTable()}>Click tops {tempLength}</button> -->

<!-- <p>prl: {$tableData.length}</p>
<p>cstl: {$currentShownTableData.length}</p>
<p>updatast(): {tops.updateShownTable()}</p> -->
<!-- {#each pageButtonLabels as lab}
<button
    class="paginationButton {lab === currentPage ? 'selected' : ''}"
    on:click={updateShownTable(lab)}>{lab}</button
>
{/each}-->

<div>
    Search table:
    <input type="text" bind:value={$searchString} on:keyup={tableOps.startSearch} id="searchInput" />
</div>

{#each $pageButtonLabels as label}
    <button
        class="paginationButton {label === $currentPage ? 'selected' : ''}"
        on:click={tableOps.updateShownTable(label)}>{label}</button>
{/each}

<select bind:value={selectedNumberOfRowsToDisplay} on:change={changeRowNumber(selectedNumberOfRowsToDisplay)}>
    {#each $rowNumberOptions as rno}
        {#if rno != -1}
            <option value={rno} selected={rno == selectedNumberOfRowsToDisplay}>{rno}</option>
        {:else}
            <option value={rno} selected={rno == selectedNumberOfRowsToDisplay}>All</option>
        {/if}
    {/each}
</select>

{#if $currentShownTableData.length > 0}
    <table class="w3-bordered">
        {#each $tableColumns as column}
            {#if column === 1}
                <th>Time</th>
            {/if}
            {#if column === 2}
                <th>Level</th>
            {/if}
            {#if column === 3}
                <th>Class</th>
            {/if}
            {#if column === 4}
                <th>Function</th>
            {/if}
            {#if column === 5}
                <th class="comment">Comment</th>
            {/if}
        {/each}
        {#each $currentShownTableData as row}
            <MLVDebug_TableRowItem {...row} />
        {/each}
    </table>
{/if}

{#each $pageButtonLabels as label}
    <button
        class="paginationButton {label === $currentPage ? 'selected' : ''}"
        on:click={tableOps.updateShownTable(label)}>{label}</button>
{/each}
<select bind:value={selectedNumberOfRowsToDisplay} on:change={changeRowNumber(selectedNumberOfRowsToDisplay)}>
    {#each $rowNumberOptions as rno}
        {#if rno != -1}
            <option value={rno} selected={rno == selectedNumberOfRowsToDisplay}>{rno}</option>
        {:else}
            <option value={rno} selected={rno == selectedNumberOfRowsToDisplay}>All {rno}</option>
        {/if}
    {/each}
</select>

<style lang="scss">
    table {
        table-layout: auto;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        display: table;
    }
    th {
        font-size: large;
        padding: 5px 25px;
    }
    .comment {
        width: 100%;
        text-align: left;
        padding-left: 5px;
    }
    // .w3-table-all {
    //     border: 1px solid #ccc;
    // }
    // .w3-bordered tr,
    // .w3-table-all tr {
    //     border-bottom: 1px solid #ddd;
    // }
    // .w3-striped tbody tr:nth-child(even) {
    //     background-color: #f1f1f1;
    // }

    .paginationButton {
        margin: 5px 5px 5px 0px;
    }
</style>
