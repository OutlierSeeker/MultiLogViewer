<!-- TODO proper colors -->
<script>
    import { onMount } from "svelte";
    import {
        testResults,
        filteredTestData,
        nodeAvailableExpandModes,
        nodeExpandMode,
        searchString,
    } from "./teststore";
    import ResultTree from "./ResultTree.svelte";
    import TestOps from "./TestOps.svelte";
    let testOps;

    let getBackgroundColor = () => {};

    onMount(async () => {
        // getTestDataR2M();
        // testObject = $testResults;
        // console.log(`Central: onMount: changing updateSettingR2M:`);
        // updateSettingR2M = async function (settingsObject) {
        //     console.log(`Central: updateSettingR2M: `, settingsObject);
        //     window.mlvAPI.settingsM2R(settingsObject);
        // };
        getBackgroundColor = (isSuccess) => {
            return testOps.getTestBackgroundColor(isSuccess);
        };
        // getTestClasses = () => {
        //     return testOps.getClassArray();
        // };
    });
</script>

<TestOps bind:this={testOps} />

<!-- TODO add Tab displaying the invalid rows -->
<!-- TODO search for text -->
<div class="filterRow">
    <div>
        Search table:
        <input type="text" bind:value={$searchString} on:keyup={testOps.startSearch} id="searchInput" />
    </div>

    <div class="outerDrop">
        Expand:
        <select bind:value={$nodeExpandMode} class="expandDrop">
            {#each $nodeAvailableExpandModes as ae}
                <option value={ae}>{ae}</option>
            {/each}
        </select>
    </div>
</div>
<div class="results">
    {#if $testResults.data && $filteredTestData.length > 0}
        {#each $filteredTestData as testClass}
            <ResultTree data={testClass} />
        {/each}
    {:else}
        <div>No Test Results to display.</div>
    {/if}
</div>

<style lang="scss">
    .results {
        margin-top: 20px;
    }

    .filterRow {
        display: flex;
        margin: 10px 0px 0px 5px;
    }
    .outerDrop {
        margin-left: 20px;
    }
    .expandDrop {
        margin-left: 2px;
    }
    // .caret {
    //     cursor: pointer;
    //     user-select: none;
    // }
    // /* Create the caret/arrow with a unicode, and style it */
    // .caret::before {
    //     content: "\25B6";
    //     color: black;
    //     display: inline-block;
    //     margin-right: 6px;
    // }

    // /* Rotate the caret/arrow icon when clicked on (using JavaScript) */
    // .caret-down::before {
    //     transform: rotate(90deg);
    // }

    // /* Hide the nested list */
    // .nested {
    //     display: none;
    // }

    // /* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
    // .active {
    //     display: block;
    // }
</style>
