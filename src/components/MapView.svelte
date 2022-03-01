<script lang="ts">
  import L from 'leaflet';
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { fly } from 'svelte/transition';
  import { MapPointType } from '../utils/enum';
  import axios from 'axios';
  import { ip } from '../stores';
  import About from '../pages/About.svelte';
  import type { MapPoint } from '../utils/typings';

  let map;

  let mapW = window.innerWidth;
  let mapH = window.innerHeight;

  let addPointVisability = false;
  let selectTypeVisability = false;

  /** 添加地标模式 */
  let isAddPointMode = false;

  let showfilterDiv = false;

  let currentClickedlatLng;

  let addedPointType: MapPointType = MapPointType.Empty;
  let addedPointName = '';
  let addedPointDesc = '';

  let searchWord = '';

  let checkedTypes: string[] = [];

  let markers = [];

  onMount(() => {
    map = L.map('map', { attributionControl: false, zoomControl: false, maxBounds: L.latLngBounds(L.latLng(-100, -200), L.latLng(100, 100)) }).setView([40, -40], 2);

    L.tileLayer('https://imgs.ali213.net/picfile/eldenring/{z}/{x}/{y}.jpg', {
      maxZoom: 7,
      minZoom: 2,
      tileSize: 200,
      zoomOffset: 0,
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    map.on('click', e => {
      if (isAddPointMode) {
        currentClickedlatLng = e.latlng;
        L.marker(e.latlng).addTo(map);
        addPointVisability = true;
      }
    });

    loadMarkers();
  });

  window.addEventListener('resize', e => {
    mapW = window.innerWidth;
    mapH = window.innerHeight;
  });

  const loadMarkers = () => {
    axios({
      method: 'GET',
      url: './map.php',
      params: {
        type: checkedTypes.join('|'),
        kword: searchWord,
        ip: '',
        under: '',
      },
    }).then(res => {
      console.log(res.data);
      const tmpmarkers = [];
      res.data.forEach((m: MapPoint) => {
        markers.push(L.marker(L.latLng(m.lat, m.lng)));
      });
    });

    markers.forEach(marker => {
      marker.addTo(map);
    });
  };

  const onSearch = () => {
    loadMarkers();
  };

  const onAddButtonClick = () => {
    isAddPointMode = !isAddPointMode;
  };

  const onAdd = () => {
    axios({
      method: 'POST',
      url: './map.php',
      data: {
        type: addedPointType,
        name: addedPointName,
        desc: addedPointDesc,
        lng: currentClickedlatLng.lng,
        lat: currentClickedlatLng.lat,
        like: 0,
        dislike: 0,
        ip,
      },
    }).then(res => {
      console.log(res);
    });
  };

  const onClose = () => {
    addPointVisability = false;
  };

  const onFilterButtonClick = () => {
    showfilterDiv = !showfilterDiv;
  };

  const filters = [
    { name: '我标注的', value: 'self' },
    { name: '全选', value: 'all' },

    { name: '地点', hr: true },
    { name: '赐福', value: MapPointType.Cifu },
    { name: '捷径', value: MapPointType.Jiejing },
    { name: '传送门', value: MapPointType.Portal },
    { name: '刷魂点', value: MapPointType.SoulSite },
    { name: '商店', value: MapPointType.Shop },
    { name: 'NPC', value: MapPointType.NPC },
    { name: '地图碎片', value: MapPointType.Map },
    { name: '地点', value: MapPointType.Place },

    { name: '怪', hr: true },
    { name: '小BOSS', value: MapPointType.LittleBoss },
    { name: 'BOSS', value: MapPointType.Boss },
    { name: '红灵入侵', value: MapPointType.RedSoul },
    { name: '精英怪', value: MapPointType.Jingyingguai },

    { name: '道具', hr: true },
    { name: '锻造石', value: MapPointType.Stone },
    { name: '黄金种子', value: MapPointType.GoldenSeed },
    { name: '露滴', value: MapPointType.Ludi },
    { name: '逃课道具', value: MapPointType.Taoke },
    { name: '石灰钥匙', value: MapPointType.Key },

    { name: '武器', hr: true },
    { name: '魔法', value: MapPointType.Magic },
    { name: '祷告', value: MapPointType.Daogao },
    { name: '武器', value: MapPointType.Weapon },
    { name: '衣服', value: MapPointType.Clothes },
    { name: '战灰', value: MapPointType.Zhanhui },
    { name: '骨灰', value: MapPointType.Guhui },

    { name: '留言', hr: true },
    { name: '说明', value: MapPointType.Text },
    { name: '警示', value: MapPointType.Warn },
  ];

  const selectTypes = [
    { name: '留言', hr: true },
    { name: '说明', value: MapPointType.Text },
    { name: '警示', value: MapPointType.Warn },

    { name: '地点', hr: true },
    { name: '赐福', value: MapPointType.Cifu },
    { name: '捷径', value: MapPointType.Jiejing },
    { name: '传送门', value: MapPointType.Portal },
    { name: '刷魂点', value: MapPointType.SoulSite },
    { name: '商店', value: MapPointType.Shop },
    { name: 'NPC', value: MapPointType.NPC },
    { name: '地图碎片', value: MapPointType.Map },
    { name: '地点', value: MapPointType.Place },

    { name: '怪', hr: true },
    { name: '小BOSS', value: MapPointType.LittleBoss },
    { name: 'BOSS', value: MapPointType.Boss },
    { name: '红灵入侵', value: MapPointType.RedSoul },
    { name: '精英怪', value: MapPointType.Jingyingguai },

    { name: '道具', hr: true },
    { name: '锻造石', value: MapPointType.Stone },
    { name: '黄金种子', value: MapPointType.GoldenSeed },
    { name: '露滴', value: MapPointType.Ludi },
    { name: '逃课道具', value: MapPointType.Taoke },
    { name: '石灰钥匙', value: MapPointType.Key },

    { name: '武器', hr: true },
    { name: '魔法', value: MapPointType.Magic },
    { name: '祷告', value: MapPointType.Daogao },
    { name: '武器', value: MapPointType.Weapon },
    { name: '衣服', value: MapPointType.Clothes },
    { name: '战灰', value: MapPointType.Zhanhui },
    { name: '骨灰', value: MapPointType.Guhui },
  ];

  const onFilterCheckChange = e => {
    console.log(e.target.value, e.target.checked);
    if (e.target.checked) {
      if (!checkedTypes.includes(e.target.value)) {
        checkedTypes.push(e.target.value);
      }
    } else {
      if (checkedTypes.includes(e.target.value)) {
        checkedTypes = checkedTypes.filter(i => {
          return i === e.target.value;
        });
      }
    }
    loadMarkers();
  };
</script>

<div>
  <div id="topDiv">
    {#if !isAddPointMode}
      <input type="text" placeholder="搜索地标" bind:value={searchWord} /><button on:click={onSearch}>搜索</button>
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
      <div id="filter" style="max-height: {window.innerHeight - 80}px;">
        {#each filters as filter}
          {#if filter?.hr}
            <p class="filterHr"><span>——</span><span>{filter.name}</span><span>——</span></p>
          {:else}
            <label><input type="checkbox" value={filter.value} on:change={onFilterCheckChange} />{filter.name} </label>
          {/if}
        {/each}

        <button id="showNameBtn">标注地名</button>
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
    zindex={114600}
    showOkButton
    showCloseButton
    okButtonText="添加"
    closeButtonText="取消"
    onOKButtonClick={onAdd}
    onCloseButtonClick={onClose}
  >
    <div id="modalInner">
      <button
        on:click={() => {
          selectTypeVisability = true;
        }}
        >{selectTypes.filter(type => {
          return type.value === addedPointType;
        })?.[0]?.name || '——选择类型——'}</button
      >
      <input type="text" placeholder="名称" bind:value={addedPointName} />
      <textarea placeholder="描述" bind:value={addedPointDesc} />
    </div>
    <Modal visible={selectTypeVisability} top="10%" title="选择类型" zindex={1919810} width="{window.innerWidth * 0.8}px " backgroundOpacity={0.8}>
      <div id="selectModalInner">
        {#each selectTypes as filter}
          {#if filter?.hr}
            <p class="filterHrInModal"><span>——</span><span>{filter.name}</span><span>——</span></p>
          {:else}
            <button
              on:click={() => {
                addedPointType = filter.value;
                selectTypeVisability = false;
              }}>{filter.name}</button
            >
          {/if}
        {/each}
      </div>
    </Modal>
  </Modal>
</div>

<style>
  p {
    margin: 0;
    padding: 0;
  }
  .filterHr {
    align-self: center;
    color: #f5cc95;
  }
  .filterHrInModal {
    align-self: center;
    color: #f5cc95;
    width: -webkit-fill-available;
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
  #showNameBtn {
    margin: 4px;
    font-size: 0.6em;
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
    top: 70px;
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
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
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
  #selectModalInner {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>
