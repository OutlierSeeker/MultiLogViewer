<script>
    import { onMount } from "svelte";
    import { isDarkMode, selectedSidebarEntry } from "./../../js/stores";
    import { testColors, testResults, totalSuccessTests } from "./teststore";
    import SuccessIcon from "./../../resources/svg/SuccessIcon.svelte";
    import FailedIcon from "./../../resources/svg/FailedIcon.svelte";
    import TestOps from "./TestOps.svelte";
    let testOps;

    function setSelected() {
        $selectedSidebarEntry = "mlvtest";
    }


    let successBackgroundColor = "";
    let failedBackgroundColor = "";
    const getBackgroundColor = () => {
        // console.log("TestSide: getBack:", $testColors);
        if ($isDarkMode) {
            successBackgroundColor = $testColors[0].backgroundColorDark;
            failedBackgroundColor = $testColors[1].backgroundColorDark;
        } else {
            successBackgroundColor = $testColors[0].backgroundColorDark;
            failedBackgroundColor = $testColors[1].backgroundColorDark;
            // successBackgroundColor = $testColors[0].backgroundColorLight;
            // failedBackgroundColor = $testColors[1].backgroundColorLight;
        }
    };

    $: $isDarkMode, getBackgroundColor();

    onMount(async () => {});
</script>

<TestOps bind:this={testOps} />

<div
    id="sidebarEntry"
    class="sidebarDiv"
    class:loading={!$testResults.finishedReading}
    class:selected={$selectedSidebarEntry == "mlvtest" ? true : false}
    sideEntryColors={$isDarkMode ? "dark" : "light"}
    on:click={setSelected}>
    <div id="filename">{$testResults != "undefined" ? $testResults.filename : "test"}</div>

    <div class="testpill" title="successful tests" style="color:#000000; background-color: {successBackgroundColor};">
        <div style=" margin-right: 5px"><SuccessIcon size="14" /></div>
        {$totalSuccessTests.success}
    </div>
    <div class="testpill" title="failed tests" style="color:#000000; background-color: {failedBackgroundColor};">
        <div style=" margin-right: 5px"><FailedIcon size="14" /></div>
        {$totalSuccessTests.failed}
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

    .testpill {
        border: none;
        padding: 4px 15px 4px 10px;
        text-align: right;
        line-height: 11px;
        vertical-align: super;
        text-decoration: none;
        display: inline-flex;
        margin: 4px 2px;
        border-radius: 16px;
        user-select: none;
    }
</style>
