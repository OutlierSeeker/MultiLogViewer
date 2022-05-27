<!-- TODO add Tab displaying the invalid rows -->
<script>
    /* TODO click on debug stat opens details with filter */
    import Tabs from "../Common/Tabs.svelte";
    import MlvDebug_TableView from "./MLVDebug_TableView.svelte";
    import MlvDebug_Statistics from "./MLVDebug_Statistics.svelte";
    let tabs = ["Statistics", "Table"];
    export let activeTab = "Statistics";

    const changeTab = (e) => {
        console.log(`${e} tab changed to ${e.detail}`);
        activeTab = e.detail;
    };
</script>

<div class="container">
    <Tabs {tabs} {activeTab} on:tabChange={changeTab} />
    <div id="tabContent">
        {#if activeTab == "Statistics"}
            <MlvDebug_Statistics />
        {:else if activeTab == "Table"}
            <MlvDebug_TableView />
        {:else}
            <div>else...should not happen</div>
        {/if}
    </div>
</div>

<style lang="scss">
    .container {
        height: 100%;
        min-height: 100vh;
        min-width: 100%;
        display: flex;
        flex-direction: column;
    }

    #tabContent {
        flex: 1; /* or flex-grow: 1  */
        // overflow-x: auto;
    }
    // footer {
    //     background: lightgreen;
    //     min-height: 60px;
    // }
</style>
