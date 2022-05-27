<script>
    /* TODO format time */
    /* TODO convert table back to li and calculate widths when loading 'testResults' in `Central` */
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { nodeExpandMode } from "./teststore";
    import ChevronRight from "./../../resources/svg/ChevronRight.svelte";
    import SuccessIcon from "./../../resources/svg/SuccessIcon.svelte";
    import FailedIcon from "./../../resources/svg/FailedIcon.svelte";
    let iconSize = 18;


    export let node;
    export let level = 0;
    let failedInNode = 0;
    // let color = "#000000";
    // let chevronSize = "36";

    // let isExpanded = false;

    function setExpanded() {
        if ($nodeExpandMode == "all") {
            node.nodeExpanded = true;
        } else if ($nodeExpandMode == "failed" && !node.nodeSuccess) {
            node.nodeExpanded = true;
        } else {
            node.nodeExpanded = false;
        }
    }

    $: $nodeExpandMode, setExpanded();

    function toggle() {
        node.nodeExpanded = !node.nodeExpanded;
        // isExpanded = node.nodeExpanded;
    }

    onMount(async () => {
        // console.log("ResultNode: onMount: type:", node.nodeType, ", success:", node.nodeSuccess);
        if (node.nodeType != "entryNode") {
            if ($nodeExpandMode == "all") {
                node.nodeExpanded = true;
            } else if ($nodeExpandMode == "failed" && !node.nodeSuccess) {
                node.nodeExpanded = true;
            } else {
                node.nodeExpanded = false;
            }
        } else {
            node.nodeExpanded = false;
        }

        if (node.nodeType != "entryNode") {
            failedInNode = 0;
            node.nodeEntries.forEach((element) => {
                // console.log("node: ", node.nodeName, " - success:", node.nodeSuccess);
                if (!element.nodeSuccess) {
                    failedInNode++;
                }
            });
        }
        // isExpanded = node.nodeExpanded;
    });
</script>

{#if node.nodeType == "entryNode"}
    <!-- <tr on:click={toggle} transition:slide> -->
    <tr on:click={toggle}>
        <td>
            {#if node.nodeSuccess}
                <div class="isSuccessIcon"><SuccessIcon size={iconSize}/></div>
            {:else}
                <div class="isSuccessIcon"><FailedIcon size={iconSize} /></div>
            {/if}
        </td>
        {#if node.nodeLine}
            <td>{node.nodeLine}</td>
        {/if}
        {#if node.nodeAssertType}
            <td>{node.nodeAssertType}</td>
        {/if}
        {#if node.nodeComment}
            <td style="width: 100%;">{node.nodeComment}</td>
        {/if}
        {#if node.nodeTime}
            <td> {node.nodeTime}</td>
        {/if}
    </tr>
    <!-- <li on:click={toggle} style="padding-left:{level + 1.5}rem" transition:slide>
        {#if node.nodeSuccess}
            <div class="isSuccessIcon"><SuccessIcon /></div>
        {:else}
            <div class="isSuccessIcon"><FailedIcon /></div>
        {/if}
        {#if node.nodeTime}
            {node.nodeTime} -
        {/if}
        {#if node.nodeLine}
            {node.nodeLine}:
        {/if}
        {#if node.nodeAssertType}
            {node.nodeAssertType} -
        {/if}
        {#if node.nodeComment}
            {node.nodeComment}
        {/if}
    </li> -->
{:else}
    <!-- <li class="entryBorder" on:click={toggle} style="padding-left:{level * 1}rem" transition:slide> -->
    <li class="entryBorder" on:click={toggle} style="padding-left:{level * 1}rem">
        <!-- <div class="naviWrap"> -->
        <!-- <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 24 24">
                <path
                    d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                    stroke={color}
                    fill={color}
                    class="chevron"
                    class:expanded={node.nodeExpanded} />
            </svg> -->
        <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            width={chevronSize}
            height={chevronSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="square"
            ><polyline points="11 16 15 12 11 8" class="chevron" class:expanded={node.nodeExpanded} /></svg> -->
        <div class="chevronDiv"><ChevronRight size="12" isExpanded={node.nodeExpanded} /></div>
        <!-- </div> -->
        {#if node.nodeSuccess}
            <div class="isSuccessIcon"><SuccessIcon size={iconSize}/></div>
        {:else}
            <div class="isSuccessIcon"><FailedIcon size={iconSize}/></div>
        {/if}
        {node.nodeName}
        <span class="failedNotice">({failedInNode} of {node.nodeEntries.length} failed)</span>
    </li>
{/if}

{#if node.nodeExpanded && node.nodeEntries}
    {#if node.nodeType == "functionNode"}
        <div class="entryBorder">
            <!-- <table style="padding-left:{level + 1.5}rem" transition:slide> -->
            <table style="padding-left:{level + 1.5}rem">
                {#each node.nodeEntries as entry}
                    <svelte:self node={entry} level={level + 1} />
                {/each}
            </table>
        </div>
    {:else}
        {#each node.nodeEntries as entry}
            <svelte:self node={entry} level={level + 1} />
        {/each}
    {/if}
{/if}

<style lang="scss">
    li {
        margin: 0 0;
        // padding: 1px;
        display: flex;
        height: 26px;
        line-height: 26px;
    }
    .entryBorder {
        border-bottom: solid 1px $gray25;
    }
    table {
        margin: 0px;
        padding: 0px;
    }
    td {
        padding-left: 5px;
        padding-right: 5px;
    }
    .chevronDiv {
        margin: 2px 5px 0px 0px;
        // background-color: greenyellow;
        // vertical-align: bottom;
    }
    .failedNotice {
        // padding: 0px 0px 0px 10px;
        margin: 0px 0px 0px 8px;
        font-size: 12px;
        vertical-align: top;
    }
    .isSuccessIcon {
        margin: 4px 5px 0px 0px;
    }

    // .naviWrap {
    //     position: relative;
    //     padding-top: 3px;
    //     // margin-top: 3px;
    //     margin-right: 5px;
    //     background-color: greenyellow;
    // }

</style>
