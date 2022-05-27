<script>
    /* see: https://svelte.dev/repl/206f105d5ece4e6fa05b309463ceeb17?version=3.46.4 */
    export let filters = ["2021-04-20 to 2021-05-20", "Festival Experience"];
</script>

<div class="filters">
    <ul class="applied">
        {#each filters as filter (filter)}
            <li>{filter} <button>🞫</button></li>
        {/each}
    </ul>
    <button class="button"> Clear </button>
</div>

<style>
    .filters {
        display: grid;
        grid-area: var(--grid-area);
        background-color: #fafafa;
        grid-template-columns: 90% 10%;
        padding: 15px;
        border-radius: 3px;
    }

    .applied {
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, max-content));
        gap: 12px;
        list-style-type: none;
    }

    .applied li {
        display: grid;
        background-color: #e9e9e9;
        align-items: center;
        padding: 7px 12px 7px 12px;
        grid-template-columns: auto 20px;
        gap: 12px;
        border-radius: 20px;
    }

    .applied li button {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin: 0;
        line-height: 12px;
        padding: 4px;
    }

    .button {
        margin: 0;
        border: 1px solid #32b0a2;
        background-color: rgba(255, 255, 255, 0.66);
        border-radius: 3px;
        color: #01645a;
    }
</style>
