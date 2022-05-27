<script>
    /* TODO onHover: display detailed level/class details for each function */
    import { onMount } from "svelte";
    import { classCount, displayTop } from "./debugstores";

    let displayItems = [];

    let activeRow;

    const sortFunction = () => {
        // console.log("FunStats: sortFunction: funCount.l:", $classCount.length);
        if ($classCount.length > 0) {
            // console.log("FunStats: sortFunction: starting sort");
            $classCount.sort((a, b) => {
                return b.count - a.count;
            });
            displayItems = [];
            // console.log(
            //     "FunStats: sortFunction: $displayTop:",
            //     $displayTop,
            //     ` (${typeof $displayTop})`,
            //     " min: ",
            //     Math.min($classCount.length, $displayTop)
            // );
            for (let i = 0; i < Math.min($classCount.length, $displayTop); i++) {
                displayItems.push($classCount[i]);
            }
            // console.log("FunStats: sortFunction: finished sorting", displayItems);
        }
    };

    $: $classCount, sortFunction();

    onMount(async () => {
        sortFunction();
    });
</script>

<div style="background-color: lightgray; display:inline-block">
    <h3>Classes:</h3>

    <!-- {#if displayItems.length > 0} -->
    {#if displayItems.length > 0}
        <div>
            <table>
                <tr>
                    <th>Class</th>
                    <th>Count</th>
                </tr>
                {#each displayItems as item}
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.count}</td>
                    </tr>
                {/each}
            </table>
        </div>
    {:else}
        <div>No valid classes found!</div>
    {/if}
</div>

<style lang="scss">
    // .hidden {
    //     display: none;
    // }
</style>
