<script>
    import { createEventDispatcher } from "svelte";
    import { isDarkMode } from "../../js/stores";
    const dispatch = createEventDispatcher();
    export let tabs;
    export let activeTab;

    // const selectTab = (tabValue) => () => {
    //     // activeTab = tabValue;
    //     dispatch("tabChange", tabValue);
    // };
</script>

<div class="tabs" tabColors={$isDarkMode ? "dark" : "light"}>
    <ul>
        {#each tabs as tab}
            <li>
                <div
                    tabItem={$isDarkMode ? "dark" : "light"}
                    id="tabDiv"
                    class:selectedTab={tab === activeTab}
                    on:click={() => dispatch("tabChange", tab)}>
                    {tab}
                </div>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .tabs {
        margin-top: -16px;
        height: 51px;
        margin-left: -40px;
    }
    [tabColors="light"] {
        background-color: $gray22;
        // background-color: pink;
    }
    [tabColors="dark"] {
        background-color: $gray10;
    }
    ul {
        display: flex;
        justify-content: left;
        list-style-type: none;
    }
    #tabDiv {
        height: 25px;
        padding: 5px 10px 5px 10px;
        margin: 0 0px;
        display: block;
        user-select: none;
        cursor: pointer;
    }
    .selectedTab {
        pointer-events: none;
        cursor: default;
    }
    [tabItem="light"] {
        background-color: $gray25;
    }
    [tabItem="dark"] {
        background-color: $gray8;
    }
    [tabItem="light"]:hover {
        background-color: $gray27;
    }
    [tabItem="dark"]:hover {
        background-color: $gray6;
    }
    [tabItem="light"]:active {
        background-color: $gray29;
    }
    [tabItem="dark"]:active {
        background-color: $gray4;
    }
    .selectedTab[tabItem="light"] {
        background-color: $gray31;
    }
    .selectedTab[tabItem="dark"] {
        background-color: $gray3;
    }
</style>
