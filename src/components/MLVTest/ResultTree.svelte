<script>
    import Node from "./ResultNode.svelte";
    export let data;
    // console.log("ResultTree:", data);
</script>

<ul>
    <Node bind:node={data} />
</ul>

<style lang="scss">
    ul {
        // border-top: solid 1px $gray25;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>
