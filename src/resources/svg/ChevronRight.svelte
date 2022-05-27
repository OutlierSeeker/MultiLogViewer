<script>
    export let color = "#000000";
    export let size = 24;
    export let isExpanded = false;
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="4"
    stroke-linecap="square"
    stroke-linejoin="square">
    <polyline points="7 2 15 11 7 20" class="chevron" class:expanded={isExpanded} />
    <!-- <polyline points="11 16 15 12 11 8" class="chevron" class:expanded /> -->
</svg>

<style lang="scss">
    .chevron {
        transform-origin: 50% 50%;
        transform: rotate(0deg);
        transition: transform 0.3s ease-in-out;
    }
    .chevron.expanded {
        transform-origin: 50% 50%;
        transform: rotate(90deg);
        transition: transform 0.3s ease-in-out;
    }
</style>
