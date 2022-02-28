<script lang="ts">
	import Router from "svelte-spa-router";
	import { routes } from "./router/router";
	import { link } from "svelte-spa-router";
</script>

<div>
	<nav class="menu">
		<a href="/map" use:link>地图</a>
		<a href="/apothegm" use:link>箴言</a>
		<a href="/about" use:link>说明</a>
	</nav>
	<main>
		<Router {routes} />
	</main>
</div>

<style>
	.menu {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 70px;
		background-color: rgb(41, 41, 41);
		color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.menu a {
		width: -webkit-fill-available;
		text-align: center;
		color: whitesmoke;
	}
</style>
