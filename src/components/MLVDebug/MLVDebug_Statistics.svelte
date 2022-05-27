<script>
    import MLVDebug_LevelStats from "./MLVDebug_LevelStats.svelte";
    import MLVDebug_ClassStats from "./MLVDebug_ClassStats.svelte";
    import MLVDebug_FunctionStats from "./MLVDebug_FunctionStats.svelte";
    
    import { filename, readRows, invalidRows, levelCount, classCount, functionCount } from "./debugstores";
</script>

<div>
    <h2>Statistics</h2>

    <div class="row">
        <div class="column">
            <div>File: {$filename}</div>
            <div>Read rows: {$readRows}</div>
            <div>Invalid rows: {$invalidRows}</div>
            <div>invalidRows rows: {$invalidRows}</div>
        </div>

        <div class="column">
            <div>Number of debug levels: {$levelCount.length}</div>
            <div>Number of classes: {$classCount.length}</div>
            <div>Number of functions: {$functionCount.length}</div>
        </div>
    </div>

    <MLVDebug_LevelStats />
    <MLVDebug_ClassStats />
    <MLVDebug_FunctionStats />
</div>

<style lang="scss">
    .row {
        display: flex;
        padding: 10px 10px;
    }
    .column {
        flex: 50%;
    }
</style>
