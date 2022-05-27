<script>
    // console.log(window.mlvAPI);
    let customMessage = "hello";
    const sendMessage = () => {
        window.mlvAPI.sendMsg(customMessage);
        // customMessage = "";
    };
    const openFolder = () => {
        console.log("opening folder...");
        window.mlvAPI.openFolderDialog();
        /* TODO replace with svelte native: <input type="file" bind:files>: 
           https://svelte.dev/repl/387bf1bbbd134d0193df33ddf712fd40?version=3.14.1
        */
    };
</script>

<h2>Testing Launcher</h2>

<!-- <button on:click={window.mlvAPI.dialog3}>Dialog</button>
<button on:click={openFolderDialog}>Test me</button>
<button on:click={window.mlvAPI.openDialog("hello")}>OpenFolderIPC</button> -->
<button on:click={sendMessage}>Send Message</button>
<button on:click={openFolder}>Open Folder</button>
