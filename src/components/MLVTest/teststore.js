import { writable, derived } from 'svelte/store';

export const testResults = writable({});
export const filteredTestData = writable([]);
// export const dataArrayTest = writable([]);
export const searchString = writable("");

export const testColors = writable([
    { isSuccess: true, backgroundColorLight: '#aaffaa', backgroundColorDark: '#00ff00', },
    { isSuccess: false, backgroundColorLight: '#ffaaaa', backgroundColorDark: '#ff0000', }
]);

export const nodeAvailableExpandModes = writable(['all', 'failed', 'none']);
export const nodeExpandMode = writable('all');

// export const totatSuccessResults = writable(0);
// export const totatFailedResults = writable(0);

// let exampleDataEntry = [{
//     nodeName: 'name', nodeSuccess: true,
//     nodeEntries: [{
//         nodeName: 'fname', nodeSuccess: true,
//         nodeEntries: [{ nodeTime: 1234, nodeSuccess: true, nodeLine: 23, nodeAssertType: 'ASSERT_EQUAL', nodeComment: 'comment' }]
//     }]
// }];


export const totalSuccessTests = derived(
    testResults,
    $testResults => {
        let counts = { success: 0, failed: 0 };
        if ($testResults.data) {
            // console.log(`totalSuccessTests: ${testColors.backgroundColorDark}`);
            $testResults.data.forEach(c => {
                // console.log("teststore: c:", c.nodeName);
                c.nodeEntries.forEach(f => {
                    // console.log("teststore: f:", f.nodeName, ":", f);
                    f.nodeEntries.forEach(entry => {
                        // console.log("teststore: f:", entry.nodeComment);
                        if (entry.nodeSuccess) { counts.success++; }
                        else { counts.failed++; }
                        // console.log("teststore: f:", counts);

                    });
                });
            });
        }
        return counts;
    }
);
