<script>
    export let color = "#000000";
    export let fillColor = "#00ff00";
    export let size = 24;
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size}>
    <circle class="a" cx="12" cy="12" r="11" stroke={color} fill={fillColor} />
    <line class="b" x1="4.43" y1="12.62" x2="9.38" y2="17.57" stroke-width="2px" stroke={color} />
    <line class="b" x1="7.96" y1="17.57" x2="18.57" y2="6.96" stroke-width="2px" stroke={color} />
</svg>
