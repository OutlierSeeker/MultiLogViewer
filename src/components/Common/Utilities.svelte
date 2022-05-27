<script>
    import { fileData, selectedSidebarEntry } from "../../js/stores";
    import { tableData as tableDataDebug } from "../MLVDebug/debugstores";
    import { functionTimes } from "../MLVFunctionTimes/functiontimestores";
    import { testResults } from "../MLVTest/teststore";
    import { kinCompareData } from "../KinCompare/kcstores";

    export const resetData = () => {
        console.log("Utilities: resetData: resetting");
        $fileData = {};
        $selectedSidebarEntry = "overview";

        $tableDataDebug = [];
        $testResults = {};
        $functionTimes = {};
        $kinCompareData = {};
    };

    export const openFolderDialog = () => {
        window.mlvAPI.openFolderDialog((data) => {
            if (data.loadingFolder) {
                console.log("loading folder...");
            }
        });
    };
</script>
