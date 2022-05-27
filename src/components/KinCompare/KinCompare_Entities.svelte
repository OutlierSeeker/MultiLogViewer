<script>
    import { onMount } from "svelte";
    import { kinCompareData, filteredCompareData, shownCompareData, numberOfRowsToDisplay } from "./kcstores";
    import { searchInputDelay, rowNumberOptions } from "../../js/stores";
    import TableOps from "../Common/TableOps.svelte";
    let tableops;

    
</script>

{#if $kinCompareData?.compareEntries}
    <h2>I'm here and got entries</h2>
{/if}