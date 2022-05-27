<script>
    import { isDarkMode, selectedSidebarEntry } from "./../../js/stores";
    import { kinCompareData } from "./kcstores";

    const setSelected = () => {
        $selectedSidebarEntry = "kincompare";
    };
</script>

<div
    id="sidebarEntry"
    class="sidebarDiv"
    class:loading={!$kinCompareData.finishedReading}
    class:selected={$selectedSidebarEntry == "kincompare" ? true : false}
    sideEntryColors={$isDarkMode ? "dark" : "light"}
    on:click={setSelected}>
    <div id="filename">{$kinCompareData ? $kinCompareData.filename : "no valid compare filename"}</div>
    <div class="loaded">{$kinCompareData?.rowTableObject?.baseTable?.length} comparisons loaded</div>
    <div class="loaded">
        {$kinCompareData?.compareEntries?.length} entit{$kinCompareData?.compareEntries?.length == 1 ? "y" : "ies"} loaded
    </div>
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
        margin: 10px 5px 10px 5px;
    }
</style>
