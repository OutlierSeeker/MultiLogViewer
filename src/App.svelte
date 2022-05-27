<script>
	import Central from "./components/Common/Central.svelte";
	import Launcher from "./components/Launcher/Launcher.svelte";
	import { isDarkMode } from "./js/stores";

	const bodyID = document.getElementsByTagName("body")[0].id;

	if ($isDarkMode) {
		document.getElementsByTagName("body")[0].classList.add("toggledDark");
	} else {
		document.getElementsByTagName("body")[0].classList.remove("toggledDark");
	}

	function toggleDark() {
		console.log("old darkMode:", $isDarkMode);
		if ($isDarkMode) {
			document.getElementsByTagName("body")[0].classList.remove("toggledDark");
		} else {
			document.getElementsByTagName("body")[0].classList.add("toggledDark");
		}
		$isDarkMode = !$isDarkMode;
	}
</script>

<div id="appDiv">
	<!-- <button on:click={toggleDark} style="margin-left: 100px;">{darkMode ? "go white" : "go dark"}</button> -->
	<button id="darkModeButton" on:click={toggleDark}>{$isDarkMode ? "go light" : "go dark"}</button>
	{#if bodyID == "centralBodyID"}
		<Central />
	{:else if bodyID == "launcherBodyID"}
		<Launcher />
	{:else}
		<h2>Unknown bodyID</h2>
	{/if}
</div>

<style lang="scss">
	#appDiv {
		height: 100vh;
		min-height: 100vh;
	}
	:global(body) {
		font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
		color: $textColorLight;
		background-color: $backgroundColorLight;
	}
	:global(body.toggledDark) {
		color: $textColorDark;
		background-color: $backgroundColorDark;
	}

	#darkModeButton {
		position: absolute;
		right: 10px;
		bottom: 10px;
	}
</style>
