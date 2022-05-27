<script>
    import { onMount } from "svelte";
    import { isDarkMode, selectedSidebarEntry } from "./../../js/stores";
    import { functionTimes } from "./functiontimestores";

    const setSelected = () => { $selectedSidebarEntry = "mlvfunctimes"; };

    onMount(async () => {});
</script>

<!-- <TestOps bind:this={testOps} /> -->

<div
    id="sidebarEntry"
    class="sidebarDiv"
    class:loading={!$functionTimes.finishedReading}
    class:selected={$selectedSidebarEntry == "mlvfunctimes" ? true : false}
    sideEntryColors={$isDarkMode ? "dark" : "light"}
    on:click={setSelected}>
    <div id="filename">{$functionTimes != "undefined" ? $functionTimes.filename : "no valid times filename"}</div>
    <!-- <div class="functionTimes">Function Times:</div> -->
    <div class="loaded">{$functionTimes.data?.length} functions loaded</div>
</div>

<style lang="scss">
    .sidebarDiv {
        padding: 5px 5px 5px 5px;
    }

    #filename {
        font-size: 16px;
        font-weight: bold;
        font-family: "Courier New", Courier, monospace;
        padding: 2px 2px 2px 2px;
    }

    .loaded {
        font-size: 14px;
        margin: 10px 5px 10px 20px;
    }
</style>
