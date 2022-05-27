<script>
    /* TODO add class variable -> header for each class and navbar */
    import { appColors } from "../../js/stores";
    import {
        filteredFunctionTimesData,
        bookmarkedFunctions,
        chartModes,
        currentChartMode,
        searchString,
    } from "./functiontimestores";
    import MLVFuncTimes_MainEntry from "./MLVFuncTimes_MainEntry.svelte";
    import MLVFuncTimes_Ops from "./MLVFuncTimes_Ops.svelte";
    import Bookmarks from "../../resources/svg/Bookmarks.svelte";
    let functimeops;

    function setMode(mode) {
        console.log(mode);
    }

    function removeBookmark(event) {
        if ($bookmarkedFunctions.includes(event.detail.fname)) {
            let index = $bookmarkedFunctions.indexOf(event.detail.fname);
            $bookmarkedFunctions.splice(index, 1);
        }
        $bookmarkedFunctions = $bookmarkedFunctions;
    }

    function addBookmark(event) {
        // console.log("FuncMain: addBookmark", event.detail.fname);
        if (!$bookmarkedFunctions.includes(event.detail.fname)) {
            // console.log("FuncMain: addBookmark: adding", event.detail.fname);
            $bookmarkedFunctions.push(event.detail.fname);
            // console.log("FuncMain: addBookmark: fftd.l:", $filteredFunctionTimesData.length);
        }
        // console.log("FuncMain: addBookmark: added", event.detail.fname, " - ", $bookmarkedFunctions);

        $bookmarkedFunctions = $bookmarkedFunctions;
    }
</script>

<MLVFuncTimes_Ops bind:this={functimeops} />

<div class="filterRow">
    Diplay Chart Mode:&nbsp;
    <select bind:value={$currentChartMode}>
        {#each $chartModes as mode}
            <option value={mode.mode}>{mode.displayAs}</option>
        {/each}
    </select>

    <div class="searchWrapper">
        Search Functions:
        <input type="text" bind:value={$searchString} on:keyup={functimeops.startSearch} id="searchInput" />
    </div>
</div>

{#if $filteredFunctionTimesData.length > 0}
    {#if $bookmarkedFunctions}
        <h2><Bookmarks color={$appColors.mainFont} />&nbsp;Bookmarked Functions</h2>
        {#each $filteredFunctionTimesData as func}
            {#if $bookmarkedFunctions.includes(func.functionName)}
                <MLVFuncTimes_MainEntry {...func} status="pinned" on:removeBookmark={removeBookmark} />
            {/if}
        {/each}
    {/if}
    <h2>Functions</h2>
    {#each $filteredFunctionTimesData as func}
        {#if !$bookmarkedFunctions.includes(func.functionName)}
            <MLVFuncTimes_MainEntry {...func} on:addBookmark={addBookmark} />
        {/if}
    {/each};
{/if}

<style lang="scss">
    .filterRow {
        display: flex;
        margin: 10px 0px 0px 5px;
    }

    .searchWrapper {
        padding-left: 20px;
    }
</style>
