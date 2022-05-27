<script>
    import { displayLevelColors, tableColors, tableColumns } from "./debugstores";
    import { isDarkMode } from "./../../js/stores";

    export let debugTime = "";
    export let debugLevel = "";
    export let debugClass = "";
    export let debugFunction = "";
    export let debugComment = "";

    let isActive = false;

    let rowColor = "#eedd08";
    let levelColor = "#ff0000";
    let rowBackgroundColor = "#eedd08";
    let levelBackgroundColor = "#05eedd";

    function isLineDefaultColor() {
        if ($tableColumns.indexOf(2) === -1) {
            return true;
        } else {
            return false;
        }
    }

    function setColors() {
        let lvlCol;
        let defCol = $tableColors.filter((obj) => obj.level === "UNKNOWN");
        if ($tableColumns.indexOf(2) === -1) {
            lvlCol = defCol;
        } else {
            lvlCol = $tableColors.filter((obj) => obj.level === debugLevel.toUpperCase());
            if (lvlCol.length === 0) {
                lvlCol = defCol;
            }
        }
        if ($isDarkMode) {
            rowColor = defCol[0].colorDark;
            rowBackgroundColor = defCol[0].backgroundColorDark;
            levelColor = lvlCol[0].colorDark;
            levelBackgroundColor = lvlCol[0].backgroundColorDark;
        } else {
            rowColor = defCol[0].colorLight;
            rowBackgroundColor = defCol[0].backgroundColorLight;
            levelColor = lvlCol[0].colorLight;
            levelBackgroundColor = lvlCol[0].backgroundColorLight;
        }
    }

    $: $displayLevelColors, setColors();
    $: $tableColors, setColors();
    $: $isDarkMode, setColors();
    $: debugLevel, setColors();
</script>

{#if $displayLevelColors === "line"}
    <tr style="color: {levelColor}; background-color: {levelBackgroundColor}">
        {#each $tableColumns as column}
            {#if column === 1}
                <td style="color: {rowColor}; backgroundColor: {rowBackgroundColor}">{debugTime}</td>
            {/if}
            {#if column === 2}
                <td>{debugLevel}</td>
            {/if}
            {#if column === 3}
                <td>{debugClass}</td>
            {/if}
            {#if column === 4}
                <td>{debugFunction}</td>
            {/if}
            {#if column === 5}
                <td class="comment">{debugComment}</td>
            {/if}
        {/each}
    </tr>
{:else if $displayLevelColors === "levelColumn" || $displayLevelColors === "none"}
    <tr style="color: {rowColor}; background-color: {rowBackgroundColor}">
        {#each $tableColumns as column}
            {#if column === 1}
                <td>{debugTime}</td>
            {/if}
            {#if column === 2}
                {#if $displayLevelColors === "levelColumn"}
                    <td style="color: {levelColor}; background-color: {levelBackgroundColor}">{debugLevel}</td>
                {:else}
                    <td>{debugLevel}</td>
                {/if}
            {/if}
            {#if column === 3}
                <td>{debugClass}</td>
            {/if}
            {#if column === 4}
                <td>{debugFunction}</td>
            {/if}
            {#if column === 5}
                <td class="comment">{debugComment}</td>
            {/if}
        {/each}
    </tr>
{/if}

<style lang="scss">
    td {
        text-align: center;
        padding: 5px 5px;
    }
    .comment {
        width: 100%;
        text-align: left;
        padding-left: 5px;
    }
</style>
