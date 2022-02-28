<!--
  自定义按钮组件
  Author: wniko
-->
<script lang="ts">
	export let style: string = "";
	export let type: "normal" | "blue" | "warning" = "normal";
	export let disabled: boolean = false;

	let typeStyle = "";
	switch (type) {
		case "normal":
			typeStyle = "background-color: white; color: black; border-color: darkgray;";
			break;
		case "blue":
			typeStyle = "background-color: #5fb4d4; color: white; border-color: auto;";
			break;
		case "warning":
			typeStyle = "background-color: red; color: white; border-color: auto;";
			break;
	}
	let finalStyle = typeStyle + style;
</script>

<button class="mybutton" style={finalStyle} on:click {disabled}><slot /></button>

<style>
	.mybutton {
		background-color: white;
		border: 1px solid darkgray;
		width: 35vw;
		border-radius: 10px;
		transition: 0.2s;
	}
	@media (any-hover: hover) {
		.mybutton:hover {
			width: 37vw;
		}
	}
	.mybutton:active {
		background-color: gray;
		width: 33vw;
	}
</style>
