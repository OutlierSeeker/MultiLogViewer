<script>
    /* TODO onHover: display detailed level/class details for each function */
    import { onMount } from "svelte";
    import { levelCount, displayTop } from "./debugstores";

    let displayItems = [];

    let activeRow;

    const sortFunction = () => {
        // console.log("FunStats: sortFunction: funCount.l:", $levelCount.length);
        if ($levelCount.length > 0) {
            // console.log("FunStats: sortFunction: starting sort");
            $levelCount.sort((a, b) => {
                return b.count - a.count;
            });
            displayItems = [];
            // console.log(
            //     "FunStats: sortFunction: $displayTop:",
            //     $displayTop,
            //     ` (${typeof $displayTop})`,
            //     " min: ",
            //     Math.min($levelCount.length, $displayTop)
            // );
            for (let i = 0; i < Math.min($levelCount.length, $displayTop); i++) {
                displayItems.push($levelCount[i]);
            }
            // console.log("FunStats: sortFunction: finished sorting", displayItems);
        }
    };

    $: $levelCount, sortFunction();

    onMount(async () => {
        sortFunction();
    });
</script>

<div style="background-color: lightgray; display:inline-block">
    <h3>Debug Level:</h3>

    <!-- {#if displayItems.length > 0} -->
    {#if displayItems.length > 0}
        <div>
            <table>
                <tr>
                    <th>Level</th>
                    <th>Count</th>
                </tr>
                {#each displayItems as item}
                    <tr>
                        <td>{item.level}</td>
                        <td>{item.count}</td>
                    </tr>
                {/each}
            </table>
        </div>
    {:else}
        <div>No valid level found!</div>
    {/if}
</div>

<style lang="scss">
    // .hidden {
    //     display: none;
    // }
</style>
