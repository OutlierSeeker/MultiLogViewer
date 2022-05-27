<script>
    import { isDarkMode, selectedSidebarEntry } from "./../../js/stores";

    function setSelected() {
        $selectedSidebarEntry = "overview";
    }
</script>

<div
    id="sidebarEntry2"
    class="overviewEntry"
    class:selected={$selectedSidebarEntry == "overview" ? true : false}
    sideEntryColors={$isDarkMode ? "dark" : "light"}
    on:click={setSelected}>
    <h3 class="overviewTitle">Overview</h3>
</div>

<style lang="scss">
    .overviewEntry {
        height: 60px;
    }

    .overviewTitle {
        padding: 10px 5px 5px 5px;
    }
</style>
