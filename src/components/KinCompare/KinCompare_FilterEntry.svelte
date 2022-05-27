<script>
    import { grays } from "../../js/colorstores";
    import X from "../../resources/svg/X.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    // export let filter = { key: [], code: 0, value: ''};

    // let keyDisplay = $kinCompareData?.availableFilters?.filter(e => e.key == filter.key);

    // console.log('FilterEntry: keyDisplay', keyDisplay, ' - ', filter);
    export let index = -1;
    export let keyDisplay = [];
    export let codeDisplay = 0;
    export let value = "test";

    let bgc = $grays[30];

    const setHover = (isHover) => {
        console.log("setHover:", isHover);
        if (isHover) {
            bgc = $grays[28];
        } else {
            bgc = $grays[30];
        }
    };

    function deleteMe() {
        console.log("entry: delete:", index);
        dispatch("deleteFilter", { i: index });
    }
</script>

<span
    class="savedFilterWrap"
    style="background-color: {bgc}; border-color: {$grays[22]};"
    on:mouseenter={() => setHover(true)}
    on:mouseleave={() => setHover(false)}
    ><span class="filterButtonWrap"
        ><div style="margin-top: -1px;">{index}: {keyDisplay} : {codeDisplay} - {value}</div>
        <button class="closedSavedFilter" on:click={deleteMe}> <div class="xWrap"><X size={14} /></div></button>
    </span></span>

<style lang="scss">
    .savedFilterWrap {
        // box-orient: vertical;
        // box-direction: normal;
        // flex-direction: column;
        display: inline-flex;
        justify-content: center;
        min-width: 0;
        word-wrap: break-word;
        background-clip: border-box;
        border-width: 1px;
        border-style: solid;
        // border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 0.25rem;
        padding: 0px 4px 2px 4px;
        // padding: 0.07rem 0.4rem 0.07rem 0.4rem;
        margin: 4px 5px;
    }

    .filterButtonWrap {
        display: inline-flex;
        margin-top: 2px;
        margin-left: 4px;
    }

    .closedSavedFilter {
        margin-left: 6px;
        margin-top: 1px;
        height: 18px;
        width: 18px;
    }

    .xWrap {
        margin-top: 0px;
        margin-left: -6px;
    }
</style>
