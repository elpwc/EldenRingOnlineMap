<script lang="ts">
  import L from 'leaflet';
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { fly } from 'svelte/transition';
  import { MapPointType } from '../utils/typings';

  let map;

  let mapW = window.innerWidth;
  let mapH = window.innerHeight;

  let addPointVisability = false;

  /** 添加地标模式 */
  let isAddPointMode = false;

  let showfilterDiv = false;

  onMount(() => {
    map = L.map('map').setView([40, -40], 2);

    L.tileLayer('https://imgs.ali213.net/picfile/eldenring/{z}/{x}/{y}.jpg', {
      attribution: 'Data <a href="https://www.ali213.net/zt/eldenring/map/" target="_blank">Youxia</a>',
      maxZoom: 7,
      tileSize: 200,
      zoomOffset: 0,
    }).addTo(map);

    map.on('click', e => {
      if (isAddPointMode) {
        L.marker(e.latlng).addTo(map);
        addPointVisability = true;
      }
    });
  });

  window.addEventListener('resize', e => {
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

  const onFilterButtonClick = () => {
    showfilterDiv = !showfilterDiv;
  };

  const filters = [
    { name: '我标注的', value: MapPointType.Empty },
    { name: '篝火', value: MapPointType.Empty },
    { name: '小BOSS', value: MapPointType.LittleBoss },
    { name: 'BOSS', value: MapPointType.Boss },
    { name: '黄金种子', value: MapPointType.GoldenSeed },
    { name: '魔法', value: MapPointType.Magic },
    { name: '祷告', value: MapPointType },
    { name: '武器', value: MapPointType.Weapon },
    { name: '锻造石', value: MapPointType },
    { name: '露滴', value: MapPointType },
    { name: '说明', value: MapPointType },
    { name: '警示', value: MapPointType },
    { name: '红灵入侵', value: MapPointType },
    { name: '装备', value: MapPointType },
    { name: '精英怪', value: MapPointType },
    { name: '捷径', value: MapPointType },
    { name: '传送门', value: MapPointType },
    { name: '刷魂点', value: MapPointType },
    { name: '逃课道具', value: MapPointType },
    { name: '商店', value: MapPointType },
  ];

  const onFilterCheckChange = e => {
    console.log(e.target.value, e.target.checked);
  };
</script>

<div>
  <div id="topDiv">
    {#if !isAddPointMode}
      <input type="text" placeholder="搜索地标" /><button on:click={onSearch}>搜索</button>
    {:else}
      <p id="addpointtip">在地图上点击一点添加坐标</p>
    {/if}

    <button id="addPointButton" on:click={onAddButtonClick}>
      {#if !isAddPointMode}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      {/if}
      <p>
        {isAddPointMode ? '返回地图' : '添加地标'}
      </p>
    </button>
  </div>

  {#if showfilterDiv}
    <div id="filterDiv" transition:fly={{ x: -80, duration: 300 }}>
      <div id="filter">
        {#each filters as filter}
          <label><input type="checkbox" value={filter.value} on:change={onFilterCheckChange} />{filter.name} </label>
        {/each}
      </div>
    </div>
    <div id="leftDiv2" in:fly={{ x: -85, duration: 300 }} out:fly={{ x: -85, duration: 300 }}>
      <button id="filterBtn" on:click={onFilterButtonClick}>◀<br />收<br />回</button>
    </div>
  {:else}
    <div id="leftDiv" in:fly={{ x: 85, duration: 300 }} out:fly={{ x: 85, duration: 300 }}>
      <button id="filterBtn" on:click={onFilterButtonClick}>➤<br />筛<br />选</button>
    </div>
  {/if}

  <div id="bottomDiv" />

  <div id="map" style="width: {mapW}px; height: {mapH - 70 + 1}px; background-color: #222222;" />

  <Modal
    visible={addPointVisability}
    top="15%"
    title="添加一个地标"
    zindex={114514}
    showOkButton
    showCloseButton
    okButtonText="添加"
    closeButtonText="取消"
    onOKButtonClick={onAdd}
    onCloseButtonClick={onClose}
  >
    <div id="modalInner">
      <select name="pointType">
        <option>类型</option>
      </select>
      <input type="text" placeholder="名称" />
      <textarea placeholder="描述" />
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
  button {
    font-size: 1em;
  }
  input,
  textarea,
  select {
    font-size: 1em;
  }
  textarea {
    height: 100px;
  }
  #addPointButton {
    margin-left: 5px;
	display: flex;
	align-items: center;
	min-width: fit-content;
  }
  #filterBtn {
    border-radius: 5px;
    padding-bottom: 10px;
    background-color: rgb(21, 22, 17, 0.7);
  }
  #topDiv {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 114514;
    align-self: center;
    margin-top: 20px;
    display: flex;
    height: 30px;
  }
  #leftDiv {
    position: absolute;
    top: 100px;
    left: -5px;
    z-index: 114514;
    align-self: center;
  }
  #leftDiv2 {
    position: absolute;
    top: 100px;
    left: 75px;
    z-index: 114514;
    align-self: center;
  }
  #filterDiv {
    position: absolute;
    top: 100px;
    left: 0px;
    width: 80px;
    z-index: 114515;
    align-self: center;
  }
  #filter {
    border: solid 1px rgb(208, 200, 181);
    box-shadow: 0 0 2px 0 white;
    background-color: rgb(21, 22, 17, 0.7);
    color: rgb(208, 200, 181);
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.3em;
    display: flex;
    flex-direction: column;
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
    color: rgb(208, 200, 181);
    text-shadow: 0 0 5px black;
    background-color: rgb(21, 22, 17, 0.7);
    border-top: solid 1px rgb(208, 200, 181);
    border-bottom: solid 1px rgb(208, 200, 181);
    padding: 3px 15px;
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
