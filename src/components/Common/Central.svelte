<script>
    import { onMount } from "svelte";
    import Sidebar from "../Common/Sidebar.svelte";
    import MLVOverview from "../MLVOverview/MLVOverview.svelte";
    import MLVDebugMain from "./../MLVDebug/MLVDebug_Main.svelte";
    import MLVTestMain from "../MLVTest/MLVTest_Main.svelte";
    import MLVFuncTimesMain from "../MLVFunctionTimes/MLVFuncTimes_Main.svelte";
    import KinCompareMain from "../KinCompare/KinCompare_Main.svelte";
    import {
        fileData,
        loadedModules,
        generalSettings,
        numberOfLastDirectories,
        lastDirectories,
        logModules,
        isDarkMode,
        searchInputDelay,
        defaultNumberOfTableRows,
        rowNumberOptions,
        numberOfPaginationButtonsOnTheSide,
        selectedSidebarEntry,
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
        filteredTableData,
    } from "./../MLVDebug/debugstores";
    import { testResults, filteredTestData } from "../MLVTest/teststore";
    import { functionTimes, filteredFunctionTimesData } from "../MLVFunctionTimes/functiontimestores";
    import { kinCompareData } from "../KinCompare/kcstores";
    import Utilities from "./Utilities.svelte";
    let utils;

    let sidebarWidth = `200px`;
    // let currentPage = "mlvdebug";
    let showSidebar = true;

    const toggleSidebar = () => (showSidebar = !showSidebar);
    function handleToggleSidebar() {
        toggleSidebar();
    }

    window.mlvAPI.initializeFileDataM2R((data) => {
        utils.resetData();
        console.log(`Central: initializeFileDataM2R: Receiving file data:`, data);
        $fileData = data;
        // console.log(`Central: initializeFileDataM2R: loaded modules: `, $loadedModules);

        if ($loadedModules.includes("MLVDebug")) {
            getDebugDataR2M();
        } else {
            console.log("not displaying MLVDebug");
        }
        if ($loadedModules.includes("MLVTest")) {
            console.log("Central: initializeFileDataM2R: getting testDataR2M... ", $testResults);
            getTestDataR2M();
        }
        if ($loadedModules.includes("MLVFunctionTimes")) {
            getFunctionTimeDataR2M();
        }
        if ($loadedModules.includes("KinCompare")) {
            getKinCompareDataR2M();
        }
    });

    window.mlvAPI.settingsM2R((data) => {
        console.log(`Central: Receiving settings:`, data);
        $generalSettings = data;
        $numberOfLastDirectories = data.General.numberOfLastDirectories;
        $lastDirectories = data.General.lastDirectories;
        $logModules = data.General.logModules;
        $isDarkMode = data.General.isDarkMode;
        $searchInputDelay = data.General.searchInputDelay;
        $defaultNumberOfTableRows = data.General.defaultNumberOfTableRows;
        $rowNumberOptions = data.General.rowNumberOptions;
        $numberOfPaginationButtonsOnTheSide = data.General.numberOfPaginationButtonsOnTheSide;
        // console.log(`Central: settingsM2R: genSet:`, generalSettings, "seInDel:", $searchInputDelay);
    });

    window.mlvAPI.debugDataM2R((data) => {
        console.log("Central: receiving debug data:", data);
        $filename = data.dFilename;
        $finishedReading = data.dFinishedReading;
        $readRows = data.dReadRows;
        $invalidRows = data.dInvalidRows;
        $sortedLevelCounts = data.dSortedLevelCounts;
        $levelCount = data.dLevelCount;
        $classCount = data.dClassCount;
        $functionCount = data.dFunctionCount;
        // console.log("Central functions: ", data.dFunctionCount, " - $functionCount: ", $functionCount);
        // console.log("pR:", $tableData, "data.pR:", data.dParsedRows.length);
        /* TODO change when in production */
        // $parsedRows = [];
        // data.dParsedRows.forEach((element) => {
        //     $parsedRows.push(element);
        // });
        // $parsedRows = $parsedRows;
        tableData.update((oldRows) => [...oldRows, ...data.dParsedRows]);
        $filteredTableData = $tableData;

        // $parsedRows = [...$parsedRows, ...data.dParsedRows];
        // console.log("pR:", $parsedRows);
        // console.log("pFR:", $finishedReading, "ftd.l:", $filteredTableData.length);

        // sidebarData = data;
        // for(let i = 0; i < )
        // arr = data.sortedLevelCounts;
        // console.log("arr:", arr);
    });

    // let x;
    window.mlvAPI.testDataM2R((args) => {
        console.log("Central: testDataM2R:", args);
        // let x = JSON.stringify(args);
        // $testResults = JSON.parse(x);
        $testResults = args;
        if (args.data) {
            $filteredTestData = args.data;
        }
        // $dataArrayTest = args.data;
        // console.log("Central: testDataM2R: $testData...", $testResults.data.length, ' dataArray.l:', $dataArrayTest.length);
        // console.log("Central: testDataM2R: $testData...", $testResults.data[0].nodeSuccess);
        // x = args.data[0].nodeEntries[0].nodeEntries[0].nodeLine;
    });
    window.mlvAPI.functionTimesDataM2R((args) => {
        console.log("Central: functionTimesDataM2R:", args);
        $functionTimes = args;
        if (args.data) {
            $filteredFunctionTimesData = args.data;
        }
    });
    window.mlvAPI.kinCompareDataM2R((args) => {
        console.log("Central: kinCompareDataM2R:", args);
        $kinCompareData = args;
    });

    const getDebugDataR2M = async () => {
        // console.log("Central: getDebugDataR2M...");
        window.mlvAPI.debugDataR2M();
        if (!$finishedReading) {
            const getDebugDataTimer = setInterval(() => {
                // console.log("sending data request, current:", sidebarData);
                if ($finishedReading === true) {
                    clearInterval(getDebugDataTimer);
                } else {
                    window.mlvAPI.debugDataR2M();
                }
            }, 2000);
        }
    };

    const getTestDataR2M = async () => {
        // console.log("Central: getTestDataR2M...");
        window.mlvAPI.testDataR2M();
        if (!$testResults.finishedReading) {
            const getTestDataTimer = setInterval(() => {
                // console.log("sending data request, current:", sidebarData);
                if ($testResults.finishedReading === true) {
                    clearInterval(getTestDataTimer);
                } else {
                    window.mlvAPI.testDataR2M();
                }
            }, 1500);
        }
    };

    const getFunctionTimeDataR2M = async () => {
        // console.log("Central: getFunctionTimeDataR2M...");
        window.mlvAPI.functionTimesDataR2M();
        if (!$functionTimes.finishedReading) {
            const getFunctionTimeDataTimer = setInterval(() => {
                if ($functionTimes.finishedReading === true) {
                    clearInterval(getFunctionTimeDataTimer);
                } else {
                    window.mlvAPI.functionTimesDataR2M();
                }
            }, 1500);
        }
    };

    const getKinCompareDataR2M = async () => {
        // console.log("Central: getFunctionTimeDataR2M...");
        window.mlvAPI.kinCompareDataR2M();
        if (!$kinCompareData.finishedReading) {
            const getKinCompareDataTimer = setInterval(() => {
                if ($kinCompareData.finishedReading === true) {
                    clearInterval(getKinCompareDataTimer);
                } else {
                    window.mlvAPI.kinCompareDataR2M();
                }
            }, 1500);
        }
    };

    onMount(async () => {
        console.log("Central: Mounting...");

        window.mlvAPI.fileDataR2M();
        window.mlvAPI.settingsRequestR2M();

        // console.log(`Central: onMount: changing updateSettingR2M:`);
        // updateSettingR2M = async function (settingsObject) {
        //     console.log(`Central: updateSettingR2M: `, settingsObject);
        //     window.mlvAPI.settingsM2R(settingsObject);
        // };
    });
</script>

<Utilities bind:this={utils} />

{#if showSidebar === true}
    <!-- <p style="margin-left:400px">sw: {sidebarWidth}</p> -->
    <Sidebar {sidebarWidth} on:toggleSidebar={handleToggleSidebar} />
{:else}
    <button id="toggleSidebarButton" on:click={toggleSidebar}>&gt;&gt;</button>
{/if}
<div id="mainPanel" style="margin-left:{showSidebar ? sidebarWidth : `0px`};">
    {#if $selectedSidebarEntry == "overview" || $selectedSidebarEntry == ""}
        <MLVOverview />
    {:else if $selectedSidebarEntry == "mlvdebug"}
        <MLVDebugMain />
    {:else if $selectedSidebarEntry == "mlvtest"}
        <MLVTestMain />
    {:else if $selectedSidebarEntry == "mlvfunctimes"}
        <MLVFuncTimesMain />
    {:else if $selectedSidebarEntry == "kincompare"}
        <KinCompareMain />
    {/if}
</div>

<style lang="scss">
    #mainPanel {
        // margin-top: -16px;
        // margin-bottom: -16px;
        padding: 0px 0px 0px 0px;
        height: 100vh;
        min-height: 100vh;
    }
</style>
