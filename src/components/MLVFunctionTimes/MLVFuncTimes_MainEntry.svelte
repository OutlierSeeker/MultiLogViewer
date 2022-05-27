<script>
    /* TODO case if only run once */
    /* TODO REDESIGN: only on line with summary and action buttons -> expand to show details */
    /* TODO style disable legend items: use component & variables */
    import {
        unitMethod,
        setUnit,
        timeDecimals,
        globalMinFormat,
        currentTimeColors,
        currentChartMode,
        chartLabels,
        legendLabels,
        chartBGColors,
        chartLegendColors,
        chartGridColors,
    } from "./functiontimestores";
    import { isDarkMode } from '../../js/stores';
    import { createEventDispatcher, onMount } from "svelte";
    import Chart from "chart.js/auto";
    import AddBookmark from "./Buttons/BookmarkAdd.svelte";
    import RemoveBookmark from "./Buttons/BookmarkRemove.svelte";

    const dispatch = createEventDispatcher();

    export let functionName;
    export let nCalled = 0;
    export let comment = "";
    export let totalTime = 0;
    export let firstMin = 0;
    export let firstAverage = 0;
    export let firstMax = 0;
    export let overallMin = 0;
    export let overallAverage = 0;
    export let overallMax = 0;
    export let lastMin = 0;
    export let lastAverage = 0;
    export let lastMax = 0;
    export let status = "default"; /* default, pinned */

    const getNumberFormat = (inputNumber) => {
        let mf = "";
        if (inputNumber < 1000) {
            mf = "ns";
        } else if (inputNumber < 1000000) {
            mf = "µs";
        } else if (inputNumber < 1000000000) {
            mf = "ms";
        } else if (inputNumber < 60000000000) {
            mf = "s";
        } else if (inputNumber < 3600000000000) {
            mf = "min";
        } else {
            mf = "h";
        }
        // console.log("getNumberFormat: mf:", mf);
        return mf;
    };

    const getFuncMin = () => {
        let min = Number.MAX_VALUE;
        if (firstMin > 0 && firstMin < min) {
            min = firstMin;
        }
        if (overallMin > 0 && overallMin < min) {
            min = overallMin;
        }
        if (lastMin > 0 && lastMin < min) {
            min = lastMin;
        }
        return min;
    };

    const getFormattedNumber = (inputNumber, unit = "") => {
        // console.log("getFormattedNumber: unitMethod:", $unitMethod, ", input:", inputNumber, ", minFormat:", minFormat);
        if (unit == "") {
            if ($unitMethod == "functionMin" || $unitMethod == "globalMin") {
                unit = minFormat;
            } else if ($unitMethod == "cell") {
                unit = getNumberFormat(inputNumber);
            } else if ($unitMethod == "set") {
                unit = $setUnit;
            } else {
                console.log("error setting unit method");
                unit = "ms";
            }
            // console.log("getFormattedNumber: unit:", unit);
        }
        let fn = -1;
        if (unit == "ns") {
            fn = inputNumber = "ns";
        } else if (unit == "µs") {
            fn = (inputNumber / 1000).toFixed($timeDecimals) + "µs";
        } else if (unit == "ms") {
            fn = (inputNumber / 1000000).toFixed($timeDecimals) + "ms";
        } else if (unit == "s") {
            fn = (inputNumber / 1000000000).toFixed($timeDecimals) + "s";
        } else if (unit == "min") {
            let m = Math.floor(inputNumber / 60000000000);
            fn = m + "m " + ("0" + Math.floor((inputNumber - m * 60000000000) / 1000000000)).slice(-2) + "s";
        } else if (unit == "h") {
            let h = Math.floor(inputNumber / 3600000000000);
            fn = h + "h " + ("0" + Math.floor((inputNumber - h * 3600000000000) / 60000000000)).slice(-2) + "m";
        }
        // console.log("gnf:", inputNumber, " -> ", unit, " => ", fn);
        return fn;
    };

    function getDivisor(format) {
        if (format == "ns") {
            return 1;
        } else if (format == "µs") {
            return 1000;
        } else if (format == "ms") {
            return 1000000;
        } else if (format == "s") {
            return 1000000000;
        } else if (format == "min") {
            return 60000000000;
        } else if (format == "h") {
            return 3600000000000;
        }
    }

    let minTime = getFuncMin();
    let minFormat;
    if ($unitMethod == "functionMin") {
        minFormat = getNumberFormat(minTime);
    } else if ($unitMethod == "globalMin") {
        minFormat = $globalMinFormat;
    }

    let chart;
    let chartCanvas;
    let chartContext;
    let chartYFormat = getNumberFormat(minTime);
    let chartYDivisor = getDivisor(chartYFormat);
    let chartData = setChartData();
    let chartConfig = setChartConfig();
    // console.log('divisor:', chartYDivisor);

    function getChartDataArrayOld(index) {
        // console.log("getChartDataArray:", index, 'order: ', $currentChartMode);
        if ($currentChartMode == "byOrder") {
            if (index === 0) {
                return [firstMin, overallMin, lastMin];
            } else if (index === 1) {
                return [firstAverage, overallAverage, lastAverage];
            } else {
                return [firstMax, overallMax, lastMax];
            }
        } else {
            if (index === 0) {
                return [firstMin, firstAverage, firstMax];
            } else if (index === 1) {
                return [overallMin, overallAverage, overallMax];
            } else {
                return [lastMin, lastAverage, lastMax];
            }
        }
    }

    function getChartDataArray(index) {
        // console.log("getChartDataArray:", index, 'order: ', $currentChartMode);
        if ($currentChartMode == "byOrder") {
            if (index === 0) {
                return [firstMin / chartYDivisor, overallMin / chartYDivisor, lastMin / chartYDivisor];
            } else if (index === 1) {
                return [firstAverage / chartYDivisor, overallAverage / chartYDivisor, lastAverage / chartYDivisor];
            } else {
                return [firstMax / chartYDivisor, overallMax / chartYDivisor, lastMax / chartYDivisor];
            }
        } else {
            if (index === 0) {
                return [firstMin / chartYDivisor, firstAverage / chartYDivisor, firstMax / chartYDivisor];
            } else if (index === 1) {
                return [overallMin / chartYDivisor, overallAverage / chartYDivisor, overallMax / chartYDivisor];
            } else {
                return [lastMin / chartYDivisor, lastAverage / chartYDivisor, lastMax / chartYDivisor];
            }
        }
    }

    function setChartData() {
        // console.log("setdata: labels:", $chartLabels, " - legLabels(0):", $legendLabels[0]);
        return {
            labels: $chartLabels,
            datasets: [
                {
                    label: $legendLabels[0],
                    data: getChartDataArray(0),
                    backgroundColor: $chartBGColors[0],
                },
                {
                    label: $legendLabels[1],
                    data: getChartDataArray(1),
                    backgroundColor: $chartBGColors[1],
                },
                {
                    label: $legendLabels[2],
                    data: getChartDataArray(2),
                    backgroundColor: $chartBGColors[2],
                },
            ],
        };
    }

    function setChartConfig() {
        return {
            type: "bar",
            data: chartData,
            options: {
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    xAxes: {
                        grid: {
                            color: $chartGridColors,
                            // lineWidth: 1,
                        },
                    },
                    yAxes: {
                        grid: {
                            color: $chartGridColors,
                            // lineWidth: 1,
                        },
                //         title: {
                //             display: true,
                //             text: chartYFormat,
                // align: 'start',
                // font: {
                //     size: 15,
                // },
                //         },
                    },
                },
            },
        };
    }

    const handleLegendClick = (i) => {
        if (chart.isDatasetVisible(i)) {
            chart.hide(i);
        } else {
            chart.show(i);
        }
    };

    function updateChart() {
        // console.log("updateChart: chartLabels:", $chartLabels, " ..getChartDataArray(0):", getChartDataArray(0));
        if (chart) {
            chartData = setChartData();
            chartConfig = setChartConfig();
            // console.log("entry: updating chart...", $chartLabels, $chartBGColors[0]);
            // chart.update();
            chart.destroy();
            chart = new Chart(chartContext, chartConfig);
        }
    }

    $: $currentChartMode, updateChart();
    $: $isDarkMode, updateChart();

    function addBookmark() {
        dispatch("addBookmark", { fname: functionName });
    }
    function removeBookmark() {
        dispatch("removeBookmark", { fname: functionName });
    }

    onMount(async () => {
        chartContext = chartCanvas.getContext("2d");
        chart = new Chart(chartContext, chartConfig);
        // console.log($chartBGColors);
    });
</script>

<div class="wrap">
    <div class="nameContainer">
        <div>{functionName}</div>
        <div class="nCalled">{nCalled} call{nCalled != 1 ? "s" : ""}</div>
        <div class="nCalled">Total runtime: {getFormattedNumber(totalTime, getNumberFormat(totalTime))}</div>
        <div>{comment}</div>
        <div class="buttonDiv">
            {#if status === "default"}
                <div on:click={addBookmark}>
                    <AddBookmark />
                </div>
            {:else}
                <div on:click={removeBookmark}>
                    <RemoveBookmark />
                </div>
            {/if}
        </div>
    </div>
    <div>
        <table>
            {#if firstAverage > 0 || overallAverage > 0 || lastAverage > 0}
                <tr>
                    <td>{""}</td>
                    <td>Minimum</td>
                    <td>Average</td>
                    <td>Maximum</td>
                </tr>
            {/if}
            {#if firstAverage > 0}
                <tr>
                    <td>First calls:</td>
                    <td style="background-color: {$currentTimeColors[0].backgroundColor};"
                        >{getFormattedNumber(firstMin)}</td>
                    <td style="background-color: {$currentTimeColors[1].backgroundColor};"
                        >{getFormattedNumber(firstAverage)}</td>
                    <td style="background-color: {$currentTimeColors[2].backgroundColor};"
                        >{getFormattedNumber(firstMax)}</td>
                </tr>
            {/if}
            {#if overallAverage > 0}
                <tr>
                    <td>Overall:</td>
                    <td style="background-color: {$currentTimeColors[3].backgroundColor};"
                        >{getFormattedNumber(overallMin)}</td>
                    <td style="background-color: {$currentTimeColors[4].backgroundColor};"
                        >{getFormattedNumber(overallAverage)}</td>
                    <td style="background-color: {$currentTimeColors[5].backgroundColor};"
                        >{getFormattedNumber(overallMax)}</td>
                </tr>
            {/if}
            {#if lastAverage > 0}
                <tr>
                    <td>Last calls:</td>
                    <td style="background-color: {$currentTimeColors[6].backgroundColor};"
                        >{getFormattedNumber(lastMin)}</td>
                    <td style="background-color: {$currentTimeColors[7].backgroundColor};"
                        >{getFormattedNumber(lastAverage)}</td>
                    <td style="background-color: {$currentTimeColors[8].backgroundColor};"
                        >{getFormattedNumber(lastMax)}</td>
                </tr>
            {/if}
        </table>
    </div>
    <div class="chartWrap">
        <canvas bind:this={chartCanvas} />
    </div>
    <div class="legendListWrap">
        <ul>
            {#each chartData.datasets as dataset, i}
                <li on:click={() => handleLegendClick(i)}>
                    <div class="legendColorBox" style="background-color: {$chartLegendColors[i]}" />
                    <div>&nbsp;{dataset.label}</div>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style lang="scss">
    .wrap {
        margin: 5px;
        display: flex;
        // background-color: lightpink;
    }

    .nameContainer {
        height: 100%;
        float: left;
        // background-color: yellow;
        min-height: 100%;
    }
    .nCalled {
        font-size: 12px;
        padding: 3px 0px 0px 5px;
    }

    // .totalTime {
    //     text-align: center;
    //     float: left;
    //     // padding: 5px;
    //     height: 100%;
    //     // min-height: 100%;
    //     // background-color: lightcoral;
    // }

    .buttonDiv {
        float: left;
    }

    td {
        text-align: center;
    }
    .chartWrap {
        // height: 200px;
        width: 400px;
    }

    .legendListWrap {
        // width: 300px;
        // background-color: wheat;
        // position: relative;
        display: flex;
        align-items: center;
        justify-content: left;
    }

    li {
        // display: inline-flex;
        margin: 5px 5px 2px 10px;
        display: flex;
        align-items: left;
        justify-content: left;
        list-style: none;
        padding: 0px 10px 0px 0px;
    }
    .legendColorBox {
        margin-left: -40px;
        width: 50px;
        height: 20px;

        border-radius: 5px;
        color: #f00;
        font-size: 15px;
        font-weight: bold;
        // border: 1px solid #fff;
    }
</style>
