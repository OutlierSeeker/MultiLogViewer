<!-- Based on: https://www.w3schools.com/howto/howto_css_fixed_sidebar.asp -->
<script>
    import { createEventDispatcher } from "svelte";
    import MlvOverviewSidebarEntry from "../MLVOverview/MLVOverview_SidebarEntry.svelte";
    import MlvDebugSidebarEntry from "../MLVDebug/MLVDebug_SidebarEntry.svelte";
    import MlvTestSidebarEntry from "../MLVTest/MLVTest_SidebarEntry.svelte";
    import MlvFuncTimesSidebarEntry from "../MLVFunctionTimes/MLVFuncTimes_SidebarEntry.svelte";
    import KinCompareSidebarEntry from "../KinCompare/KinCompare_SidebarEntry.svelte";
    // import SaveIcon from "./../resources/svg/SaveIcon.svelte";
    import ButtonRow from "./ButtonRow.svelte";
    import { isDarkMode, loadedModules } from "../../js/stores";

    const dispatch = createEventDispatcher();
    // export let showSidebar = true;
    const toggleSidebar = () => {
        // showSidebar = !showSidebar;
        dispatch("toggleSidebar", {
            showTheSidebar: "showSidebar",
        });
    };

    export let sidebarWidth = `200px`;
</script>

<div id="sidenav" sidebarColors={$isDarkMode ? "dark" : "light"} style="width: {sidebarWidth};">
    <h2 id="sidebarTitle">MultLogViewer</h2>

    <ButtonRow />

    <MlvOverviewSidebarEntry />

    {#if $loadedModules.includes("MLVDebug")}
        <MlvDebugSidebarEntry />
    {/if}

    {#if $loadedModules.includes("MLVTest")}
        <MlvTestSidebarEntry />
    {/if}

    {#if $loadedModules.includes("MLVFunctionTimes")}
        <MlvFuncTimesSidebarEntry />
    {/if}

    {#if $loadedModules.includes("KinCompare")}
        <KinCompareSidebarEntry />
    {/if}

    <button id="toggleSidebarButton" on:click={toggleSidebar}>&lt;&lt;</button>
</div>

<style lang="scss">
    #sidenav {
        height: 100%;
        width: 200px;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        overflow-x: hidden;
        padding: 0 0 0 0;
    }

    div[sidebarColors="light"] {
        background-color: $gray22;
    }
    div[sidebarColors="dark"] {
        background-color: $gray10;
    }

    #sidebarTitle {
        margin: 20px 5px 20px 10px;
    }

    :global(#sidebarEntry) {
        width: 100%;
        display: block;
        // padding: 5px 5px 5px 5px;
    }

    :global(#toggleSidebarButton) {
        position: fixed;
        margin-bottom: 10px;
        bottom: 10px;
        left: 10px;
        padding: 0 0 0 0;
    }

    :global(div[sideEntryColors="light"]) {
        color: $textColorLight;
        background-color: $gray25;
    }
    :global(div[sideEntryColors="dark"]) {
        color: $textColorDark;
        background-color: $gray3;
    }
    :global(div[sideEntryColors="light"]:hover) {
        background-color: $gray27;
    }
    :global(div[sideEntryColors="dark"]:hover) {
        background-color: $gray6;
    }
    :global(div[sideEntryColors="light"]:active) {
        background-color: $gray29;
    }
    :global(div[sideEntryColors="dark"]:active) {
        background-color: $gray4;
    }
    :global(.loading[sideEntryColors="light"]) {
        color: $gray19;
        background-color: $gray29;
        user-select: none;
    }
    :global(.loading[sideEntryColors="dark"]) {
        color: $gray13;
        background-color: $gray1;
        user-select: none;
    }
    :global(.selected[sideEntryColors="light"]) {
        background-color: $gray31;
        user-select: none;
    }
    :global(.selected[sideEntryColors="dark"]) {
        background-color: $gray3;
        user-select: none;
    }
    :global(.selected[sideEntryColors="light"]:hover) {
        background-color: $gray31;
    }
    :global(.selected[sideEntryColors="dark"]:hover) {
        background-color: $gray3;
    }
</style>
