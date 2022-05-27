<script>
    import { onMount } from "svelte";
    // import { hasDebugDataChanged } from "./../MLVDebug/debugstores";

    let changeVariable = 0;

    onMount(async () => {
        // debugSummary = mlvdebug.debugSummary;
        // debugSummary = mlvdebugsbe.summ;
        // console.log("hasddc has changed: ", $hasDebugDataChanged);
        // changeVariable = window.mlvAPI.utilitiesAPI.getTestInt();
    });
</script>

<div>This is the table</div>
<p>changeVar: {changeVariable}</p>
