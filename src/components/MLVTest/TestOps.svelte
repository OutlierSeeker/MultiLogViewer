<script>
    import { isDarkMode, searchInputDelay } from "../../js/stores";
    import { testColors, testResults, filteredTestData, searchString } from "./teststore";

    export function getTestBackgroundColor(isSuccess) {
        if ($isDarkMode) {
            if (isSuccess) {
                return $testColors[0].backgroundColorDark;
            } else {
                return $testColors[1].backgroundColorDark;
            }
        } else {
            if (isSuccess) {
                return $testColors[0].backgroundColorLight;
            } else {
                return $testColors[1].backgroundColorLight;
            }
        }
    }

    export function getClassArray() {
        let clarr = [];
        console.log("TestOps:", $testResults.data.length);
        $testResults.data.forEach((element) => {
            clarr.push(element);
        });
        return clarr;
    }

    export function filterTestResults() {
        // console.log("filtering:", $searchString);
        if ($searchString == "") {
            $filteredTestData = $testResults.data;
        } else {
            let ct = [];
            let lowersearch = $searchString.toLowerCase();
            if ($testResults.data) {
                $testResults.data.forEach((classEntry) => {
                    // console.log("filterTestResults: Class:", classEntry.nodeName);
                    // let addClass = false;
                    let cCopy = {};
                    for (const [key, value] of Object.entries(classEntry)) {
                        if (key != "nodeEntries") {
                            cCopy[key] = value;
                        }
                    }
                    cCopy.nodeEntries = [];
                    // console.log("filterTestResults: ClassCopy:", cCopy);
                    classEntry.nodeEntries.forEach((functionEntry) => {
                        // console.log("filterTestResults: Function:", functionEntry.nodeName);
                        let fCopy = {};
                        for (const [key, value] of Object.entries(functionEntry)) {
                            if (key != "nodeEntries") {
                                fCopy[key] = value;
                            }
                        }
                        fCopy.nodeEntries = [];
                        // let addFunction = false;
                        functionEntry.nodeEntries.forEach((entry) => {
                            // console.log("filterTestResults: Entry:", entry);
                            // let addEntry = false;
                            for (const [key, value] of Object.entries(entry)) {
                                if ((key != "nodeExpanded") && (key != "nodeSuccess") && (key != "nodeType")) {
                                    // console.log(
                                    //     "filterTestResults: Entry.value:",
                                    //     value,
                                    //     " - searchString:",
                                    //     lowersearch
                                    // );
                                    let stringy = JSON.stringify(value);
                                    if (stringy.toLowerCase().includes(lowersearch)) {
                                        // addEntry = true;
                                        // console.log("filterTestResults: adding:", Object.assign({}, entry));
                                        fCopy.nodeEntries.push(entry);
                                        break;
                                        // rowAdded = true;
                                    }
                                }
                            }
                        });

                        if (fCopy.nodeEntries.length > 0) {
                            cCopy.nodeEntries.push(fCopy);
                        }
                    });
                    if (cCopy.nodeEntries.length > 0) {
                        ct.push(cCopy);
                    }
                });
            }
            // console.log("filterTestResults: result:", ct);
            $filteredTestData = ct;
            // $filteredTestData = $testResults;
        }
    }

    let searchInputTimeout = undefined;
    export function startSearch() {
        if (typeof searchInputTimeout != "undefined") {
            clearTimeout(searchInputTimeout);
        }
        searchInputTimeout = setTimeout(() => {
            filterTestResults();
        }, $searchInputDelay);
    }
</script>
