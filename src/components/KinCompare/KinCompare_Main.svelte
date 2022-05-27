<script>
    import Tabs from "../Common/Tabs.svelte";
    import KinCompare_Rows from "./KinCompare_Rows.svelte";
    import KinCompare_Entities from "./KinCompare_Entities.svelte";

    let tabs = ["Comparisons", "Entities", "Details"];
    export let activeTab = "Comparisons";

    const changeTab = (e) => {
        activeTab = e.detail;
    };
</script>

<div class="container">
    <Tabs {tabs} {activeTab} on:tabChange={changeTab} />
    <div id="tabContent">
        {#if activeTab == "Comparisons"}
            <KinCompare_Rows />
        {:else if activeTab == "Entities"}
            <KinCompare_Entities />
        {:else if activeTab == "Details"}
            <div>Details: Coming soon</div>
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
        flex: 1;
    }
</style>
