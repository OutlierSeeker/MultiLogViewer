<script>
    import { appColors } from "../../../js/stores";
    import Bookmark_Remove from "../../../resources/svg/Bookmark_Remove.svelte";

    $: color = $appColors.mainFont;

    function enter() {
        color = $appColors.mainFontHover;
    }

    function leave() {
        color = $appColors.mainFont;
    }
</script>

<div on:mouseenter={enter} on:mouseleave={leave}>
    <Bookmark_Remove {color} />
</div>
