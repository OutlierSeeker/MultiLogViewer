<script>
    import { isDarkMode, selectedSidebarEntry } from "./../../js/stores";
    import { tableColors, filename, finishedReading, sortedLevelCounts } from "./debugstores";

    function setSelected() {
        $selectedSidebarEntry = "mlvdebug";
    }

    /* TODO combine with other functions with same purpose: 
     https://svelte.dev/tutorial/module-exports */
    function getDebugColor(index) {
        if ($isDarkMode) {
            return $tableColors[index].colorDark;
        } else {
            return $tableColors[index].colorLight;
        }
    }
    function getDebugBackgroundColor(index) {
        if ($isDarkMode) {
            return $tableColors[index].backgroundColorDark;
        } else {
            return $tableColors[index].backgroundColorLight;
        }
    }

    // window.mlvAPI.onInitializeDebugData((data) => {
    //     console.log("setting filename:", $filename);
    //     $filename = data.idFilename;
    // });
</script>

<div
    id="sidebarEntry"
    class="sidebarDiv"
    class:loading={!$finishedReading}
    class:selected={$selectedSidebarEntry == "mlvdebug" ? true : false}
    sideEntryColors={$isDarkMode ? "dark" : "light"}
    on:click={setSelected}>
    <div id="filename">{$filename}</div>
    {#each $sortedLevelCounts as levelcount, index}
        {#if levelcount > 0}
            <div
                class="statpill"
                title={$tableColors[index].level}
                style="color: {getDebugColor(index)}; background-color: {getDebugBackgroundColor(index)};">
                {levelcount}
            </div>
        {/if}
    {/each}
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

    .statpill {
        align-items: center;
        font-family: "Open Sans", Arial, Verdana, sans-serif;
        font-weight: bold;
        font-size: 11px;
        display: inline-block;
        height: 100%;
        white-space: nowrap;
        width: auto;

        position: relative;
        border-radius: 100px;
        line-height: 1;
        overflow: hidden;
        margin: 5px 1px 0px 4px;
        padding: 0px 6px 0px 6px;
        text-overflow: ellipsis;
        line-height: 1.25rem;

        word-break: break-word;
        user-select: none;
    }
</style>
