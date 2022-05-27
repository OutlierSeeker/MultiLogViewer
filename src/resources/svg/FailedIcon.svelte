<script>
    export let color = "#000000";
    export let fillColor = "#ff0000";
    export let size = 24;
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size}>
    <circle class="a" cx="12" cy="12" r="11" stroke-width="2px" stroke={color} fill={fillColor} />
    <line class="b" x1="7.05" y1="7.05" x2="16.95" y2="16.95" stroke-width="2px" stroke={color} />
    <line class="b" x1="7.05" y1="16.95" x2="16.95" y2="7.05" stroke-width="2px" stroke={color} />
</svg>
<!-- 
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
        <style>
            .a {
                fill: #ed1c24;
            }

            .a,
            .b {
                stroke: #231f20;
                stroke-miterlimit: 10;
                stroke-width: 2px;
            }

            .b {
                fill: none;
            }
        </style>
    </defs>
    <circle class="a" cx="12" cy="12" r="11" />
    <line class="b" x1="7.05" y1="7.05" x2="16.95" y2="16.95" />
    <line class="b" x1="7.05" y1="16.95" x2="16.95" y2="7.05" />
</svg> -->
