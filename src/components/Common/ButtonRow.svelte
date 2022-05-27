<script>
    import RefreshIcon from "../../resources/svg/RefreshIcon.svelte";
    import OpenFolder from "../../resources/svg/OpenFolder.svelte";
    import SettingsIcon from "../../resources/svg/SettingsIcon.svelte";
    import { fileData } from "../../js/stores";

    function openFolder() {
        window.mlvAPI.openFolderDialogR2M();
    }
    
    function refresh() {
        window.mlvAPI.openFolderR2M($fileData.validFolderName);
    }

    function settings() {
        /* TODO implement settings */
    }

</script>

<div class="rowDiv">
    <div class="buttonDiv" on:click={openFolder}><OpenFolder /></div>
    <div class="buttonDiv" on:click={refresh}><RefreshIcon /></div>
    <div class="buttonDiv" on:click={settings}><SettingsIcon /></div>
</div>

<style lang="scss">
    .rowDiv {
        width: 100%;
        // background-color: brown;
        display: flex;
        justify-content: space-around;
        // float: inherit;
        // vertical-align: bottom;
    }

    .buttonDiv {
        width: 36px;
        height: 36px;
        margin: 0px 5px 0px 5px;
        padding: 4px 4px;
        display: inline-block;
        // background-color: lightgreen;
        vertical-align: text-bottom;
        border: 1px solid $gray22;
    }
    .buttonDiv:hover {
        // background-color: darkgreen;
        border: 1px solid $gray16;
    }
</style>
