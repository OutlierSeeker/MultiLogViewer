<script>
    import { appColors } from "../../../js/stores";
    import Bookmark_Add from "../../../resources/svg/Bookmark_Add.svelte";

    $: color = $appColors.mainFont;

    function enter() {
        color = $appColors.mainFontHover;
    }

    function leave() {
        color = $appColors.mainFont;
    }
</script>

<div on:mouseenter={enter} on:mouseleave={leave}>
    <Bookmark_Add {color} />
</div>
