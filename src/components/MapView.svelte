<script lang="ts">
	import L from "leaflet";
	import { onMount } from "svelte";
	import Modal from "./Modal.svelte";

	let map;

	let mapW = window.innerWidth;
	let mapH = window.innerHeight;

	let addPointVisability = false;

	/** 添加地标模式 */
	let isAddPointMode = false;

	onMount(() => {
		map = L.map("map").setView([40, -40], 2);

		L.tileLayer("https://imgs.ali213.net/picfile/eldenring/{z}/{x}/{y}.jpg", {
			attribution: 'Map data <a href="https://www.ali213.net/zt/eldenring/map/" target="_blank">Youxia</a>',
			maxZoom: 7,
			tileSize: 200,
			zoomOffset: 0,
		}).addTo(map);

		map.on("click", (e) => {
			if (isAddPointMode) {
                L.marker(e.latlng).addTo(map);
				addPointVisability = true;
			}
		});
	});

	window.addEventListener("resize", (e) => {
		mapW = window.innerWidth;
		mapH = window.innerHeight;
	});

	const onSearch = () => {
		alert(123);
	};

	const onAddButtonClick = () => {
		isAddPointMode = !isAddPointMode;
	};

	const onAdd = () => {};

	const onClose = () => {
		addPointVisability = false;
	};
</script>

<div>
	<div id="topDiv">
		{#if !isAddPointMode}
			<input type="text" placeholder="搜索地标" /><button on:click={onSearch}>搜索</button>
		{:else}
			<p id="addpointtip">点击任意一点添加坐标</p>
		{/if}

		<button id="addPointButton" on:click={onAddButtonClick}> {isAddPointMode ? "返回地图" : "添加地标"} </button>
	</div>
	<div id="bottomDiv" />
	<div id="map" style="width: {mapW}px; height: {mapH - 70}px;" />

	<Modal visible={addPointVisability} title="添加一个地标" zindex={114514} showOkButton showCloseButton okButtonText="添加" closeButtonText="取消" onOKButtonClick={onAdd} onCloseButtonClick={onClose}>
		<div id="modalInner">
			<select name="pointType">
				<option>类型</option>
			</select>
			<input type="text" placeholder="名称" />
			<input type="text" placeholder="描述" />
		</div>
	</Modal>
</div>

<style>
	p {
		margin: 0;
		padding: 0;
	}
	#map {
		height: 1000px;
		width: 1000px;
	}
	#addPointButton {
		margin: 10px 10px;
	}
	#topDiv {
		position: absolute;
		top: 5px;
		right: 10px;
		z-index: 114514;
		align-self: center;
		margin-top: 20px;
		display: flex;
	}
	#bottomDiv {
		position: absolute;
		bottom: 80px;
		left: 0;
		right: 0;
		z-index: 114514;
		align-self: center;
		margin-top: 20px;
	}
	#addpointtip {
		color: white;
		text-shadow: 0 0 5px black;
	}
	#modalInner {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-bottom: 40px;
	}
</style>
