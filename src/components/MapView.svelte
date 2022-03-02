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
  import { MapIcon } from './icons';
  import './icons.css';

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
  let addedPointUnderground = false;

  let searchWord = '';

  let checkedTypes: string[] = [];
  let showPlaceNames = true;
  let undergroundStatus = 0;
  let filterString = '';
  let showSelf = false;

  let selectAll = false;

  let markers = [];

  let searchResultMarkers = [];

  let tempMarker;

  let isSearch = false;

  let currentClickedMarker: MapPoint;
  let markerInfoVisibility = false;

  let deleteConfirmVisibility = false;

  let editMode = false;

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
        tempMarker = L.marker(e.latlng, {
          icon: L.divIcon(MapIcon.default()(addedPointName)),
        });
        tempMarker.addTo(map);
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
    axios
      .get('./map.php', {
        params: {
          type: selectAll ? '' : checkedTypes.join('|'),
          kword: searchWord,
          ip: showSelf ? ip : '',
          under: undergroundStatus,
        },
      })
      .then(res => {
        console.log(res.data);
        markers.forEach(marker => {
          marker.remove();
        });
        markers = [];
        res.data.forEach((m: MapPoint) => {
          markers.push(
            L.marker(L.latLng(m.lat, m.lng), {
              icon: L.divIcon(
                (
                  filters.filter(filter => {
                    return filter?.value === m.type;
                  })?.[0]?.icon as (title?: string) => {
                    html: string;
                    className: string;
                  }
                )?.(showPlaceNames ? m.name : '')
              ),
            }).on('click', () => {
              currentClickedMarker = m;
              markerInfoVisibility = true;
            })
          );
        });

        markers.forEach(marker => {
          marker.addTo(map);
        });
      });
  };

  const onSearch = () => {
    isSearch = true;

    axios
      .get('./map.php', {
        params: {
          kword: searchWord,
        },
      })
      .then(res => {
        console.log(res.data);
        searchResultMarkers.forEach(marker => {
          marker.remove();
        });
        searchResultMarkers = [];
        res.data.forEach((m: MapPoint) => {
          searchResultMarkers.push(L.marker(L.latLng(m.lat, m.lng)));
          searchResultMarkers.push(
            L.marker(L.latLng(m.lat, m.lng), {
              icon: L.divIcon(
                (
                  filters.filter(filter => {
                    return filter?.value === m.type;
                  })?.[0]?.icon as (title?: string) => {
                    html: string;
                    className: string;
                  }
                )?.(showPlaceNames ? m.name : '')
              ),
            }).on('click', () => {
              currentClickedMarker = m;
              console.log(currentClickedMarker);
              markerInfoVisibility = true;
            })
          );
        });

        searchResultMarkers.forEach(marker => {
          marker.addTo(map);
        });
      });

    //loadMarkers();
  };

  const onAddButtonClick = () => {
    isAddPointMode = !isAddPointMode;
  };

  const onAdd = () => {
    if (editMode) {
      if (addedPointName !== '' || addedPointType !== '') {
        if (addedPointName.length <= 20 || addedPointDesc.length <= 1000) {
          axios
            .patch('./map.php', {
              id: currentClickedMarker?.id,
              type: addedPointType,
              name: addedPointName,
              desc: addedPointDesc,
            })
            .then(res => {
              console.log(res);
              addPointVisability = false;
              editMode = false;
              addedPointDesc = '';
              addedPointName = '';
              addedPointType = MapPointType.Empty;
              addedPointUnderground = false;
              loadMarkers();
            });
        } else {
          alert('名字(≤20)/描述(≤1000)太长了~');
        }
      } else {
        alert('请填写名字/选择类型再提交~');
      }
    } else {
      if (addedPointName !== '' || addedPointType !== '') {
        if (addedPointName.length <= 20 || addedPointDesc.length <= 1000) {
          axios
            .post('./map.php', {
              type: addedPointType,
              name: addedPointName,
              desc: addedPointDesc,
              lng: currentClickedlatLng.lng,
              lat: currentClickedlatLng.lat,
              like: 0,
              dislike: 0,
              ip,
            })
            .then(res => {
              console.log(res);
              addPointVisability = false;
              addedPointDesc = '';
              addedPointName = '';
              addedPointType = MapPointType.Empty;
              addedPointUnderground = false;
              tempMarker.remove();
              loadMarkers();
            });
        } else {
          alert('名字(≤20)/描述(≤1000)太长了~');
        }
      } else {
        alert('请填写名字/选择类型再提交~');
      }
    }
  };

  const onClose = () => {
    addPointVisability = false;
    addedPointDesc = '';
    addedPointName = '';
    addedPointType = MapPointType.Empty;
    addedPointUnderground = false;
    tempMarker.remove();
  };

  const onFilterButtonClick = () => {
    showfilterDiv = !showfilterDiv;
  };

  const onLike = () => {
    axios
      .patch('./map.php', {
        id: currentClickedMarker?.id,
        like: Number(currentClickedMarker?.like) + 1,
      })
      .then(res => {
        currentClickedMarker.like = Number(currentClickedMarker?.like) + 1;
        loadMarkers();
      });
  };

  const onDislike = () => {
    axios
      .patch('./map.php', {
        id: currentClickedMarker?.id,
        dislike: Number(currentClickedMarker?.dislike) + 1,
      })
      .then(res => {
        currentClickedMarker.dislike = Number(currentClickedMarker?.dislike) + 1;
        loadMarkers();
      });
  };

  const onDelete = () => {
    axios
      .delete('./map.php', {
        data: {
          id: currentClickedMarker?.id,
        },
      })
      .then(res => {
        markerInfoVisibility = false;
        currentClickedMarker = undefined;
        loadMarkers();
      });
  };

  const filters = [
    { name: '我标注的', value: 'self' },
    { name: '全选', value: 'all' },

    { name: '地点', hr: true },
    { name: '赐福', value: MapPointType.Cifu, icon: MapIcon.cifu() },
    { name: '捷径', value: MapPointType.Jiejing, icon: MapIcon.yellow(15, 'yellow') },
    { name: '传送门', value: MapPointType.Portal, icon: MapIcon.yellow() },
    { name: '刷魂点', value: MapPointType.SoulSite, icon: MapIcon.yellow() },
    { name: '商店', value: MapPointType.Shop, icon: MapIcon.yellow() },
    { name: 'NPC', value: MapPointType.NPC, icon: MapIcon.yellow() },
    { name: '地图碎片', value: MapPointType.Map, icon: MapIcon.yellow() },
    { name: '地点', value: MapPointType.Place, icon: MapIcon.yellow() },

    { name: '怪', hr: true },
    { name: '小BOSS', value: MapPointType.LittleBoss, icon: MapIcon.red() },
    { name: 'BOSS', value: MapPointType.Boss, icon: MapIcon.red(15) },
    { name: '红灵入侵', value: MapPointType.RedSoul, icon: MapIcon.red() },
    { name: '精英怪', value: MapPointType.Jingyingguai, icon: MapIcon.red() },

    { name: '道具', hr: true },
    { name: '锻造石', value: MapPointType.Stone, icon: MapIcon.blue() },
    { name: '黄金种子', value: MapPointType.GoldenSeed, icon: MapIcon.blue() },
    { name: '露滴', value: MapPointType.Ludi, icon: MapIcon.blue() },
    { name: '逃课道具', value: MapPointType.Taoke, icon: MapIcon.blue() },
    { name: '石灰钥匙', value: MapPointType.Key, icon: MapIcon.blue() },

    { name: '武器', hr: true },
    { name: '魔法', value: MapPointType.Magic, icon: MapIcon.purple() },
    { name: '祷告', value: MapPointType.Daogao, icon: MapIcon.purple() },
    { name: '武器', value: MapPointType.Weapon, icon: MapIcon.purple() },
    { name: '装备', value: MapPointType.Clothes, icon: MapIcon.purple() },
    { name: '战灰', value: MapPointType.Zhanhui, icon: MapIcon.purple() },
    { name: '骨灰', value: MapPointType.Guhui, icon: MapIcon.purple() },

    { name: '留言', hr: true },
    { name: '说明', value: MapPointType.Text, icon: MapIcon.white() },
    { name: '警示', value: MapPointType.Warn, icon: MapIcon.white() },
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
    { name: '装备', value: MapPointType.Clothes },
    { name: '战灰', value: MapPointType.Zhanhui },
    { name: '骨灰', value: MapPointType.Guhui },
  ];

  const onFilterCheckChange = e => {
    console.log(e.target.value, e.target.checked);
    switch (e.target.value) {
      case 'self':
        showSelf = e.target.checked;
        break;
      case 'all':
        selectAll = e.target.checked;
        break;
      default:
        if (e.target.checked) {
          if (!checkedTypes.includes(e.target.value)) {
            checkedTypes.push(e.target.value);
          }
        } else {
          if (checkedTypes.includes(e.target.value)) {
            checkedTypes = checkedTypes.filter(i => {
              return i !== e.target.value;
            });
          }
        }
        break;
    }
    loadMarkers();
  };
</script>

<div>
  <Modal
    visible={deleteConfirmVisibility}
    top="30%"
    zindex={114700}
    showOkButton
    showCloseButton
    okButtonText="确认删除"
    closeButtonText="取消"
    onOKButtonClick={() => {
      onDelete();
      deleteConfirmVisibility = false;
    }}
    onCloseButtonClick={() => {
      deleteConfirmVisibility = false;
    }}
  />
  <Modal
    visible={markerInfoVisibility}
    top="15%"
    title={filters.filter(filter => {
      return filter.value === currentClickedMarker?.type;
    })?.[0]?.name +
      ': ' +
      currentClickedMarker?.name}
    zindex={114600}
    showOkButton
    okButtonText="关闭"
    onOKButtonClick={() => {
      markerInfoVisibility = false;
    }}
  >
    <div class="modalInner" style="align-items: center;">
      <p style="width: fit-content; max-height: {window.innerHeight * 0.4}px; overflow-y: scroll; text-shadow: 0 0 20px black;">{@html currentClickedMarker?.desc.replaceAll('\n', '<br />')}</p>
      <div>
        <button on:click={onLike}>{`给予好评 ${currentClickedMarker?.like}`}</button>
        <button on:click={onDislike}>{`给予恶评 ${currentClickedMarker?.dislike}`}</button>
      </div>

      <div>
        {#if !currentClickedMarker?.is_lock}
          <button
            on:click={() => {
              addedPointDesc = currentClickedMarker?.desc;
              addedPointName = currentClickedMarker?.name;
              addedPointType = currentClickedMarker?.type;
              addedPointUnderground = currentClickedMarker?.is_underground;

              markerInfoVisibility = false;
              editMode = true;
              addPointVisability = true;
            }}>编辑</button
          >
        {/if}

        {#if currentClickedMarker?.ip === ip}
          <button
            on:click={() => {
              deleteConfirmVisibility = true;
            }}>删除</button
          >
        {/if}
      </div>
    </div>
  </Modal>
  <div id="topDiv">
    {#if !isAddPointMode}
      <div id="searchTextContainer">
        <input type="text" style="border: none; width: 80%; box-shadow: none;" placeholder="搜索地标" bind:value={searchWord} />
        {#if isSearch}
          <button
            style="border: none; font-size: 0.6em; box-shadow: none;"
            on:click={() => {
              isSearch = false;
              searchResultMarkers.forEach(marker => {
                marker.remove();
              });
              searchWord = '';
              searchResultMarkers = [];
            }}>清除结果</button
          >
        {/if}
      </div>
      <button on:click={onSearch}>搜索</button>
    {:else}
      <p id="addpointtip">——在地图上点击一点添加坐标——</p>
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
    <div id="filterDiv" transition:fly={{ x: -160, duration: 300 }}>
      <div id="filter" style="max-height: {window.innerHeight - 80}px;">
        {#each filters as filter}
          {#if filter?.hr}
            <p class="filterHr"><span>——</span><span>{filter.name}</span><span>——</span></p>
          {:else}
            <label><input class="checkbox" type="checkbox" value={filter.value} on:change={onFilterCheckChange} />{filter.name} </label>
          {/if}
        {/each}
      </div>
      <button
        id="showNameBtn"
        on:click={() => {
          showPlaceNames = !showPlaceNames;
          loadMarkers();
        }}>显示地名{showPlaceNames ? ' √' : ''}</button
      >
      <div id="underSelector" style="padding: 3px; font-size: 0.6em;">
        <button
          class={undergroundStatus === 0 && 'active'}
          on:click={() => {
            undergroundStatus = 0;
            loadMarkers();
          }}>全部</button
        >
        <button
          class={undergroundStatus === 1 && 'active'}
          on:click={() => {
            undergroundStatus = 1;
            loadMarkers();
          }}>地下</button
        >
        <button
          class={undergroundStatus === 2 && 'active'}
          on:click={() => {
            undergroundStatus = 2;
            loadMarkers();
          }}>地面</button
        >
      </div>
      <!--input type="text" placeholder="关键词" bind:value={filterString}/-->
    </div>
    <div id="leftDiv2" in:fly={{ x: -165, duration: 300 }} out:fly={{ x: -165, duration: 300 }}>
      <button id="filterBtn" on:click={onFilterButtonClick}>◀<br />收<br />回</button>
    </div>
  {:else}
    <div id="leftDiv" in:fly={{ x: 165, duration: 300 }} out:fly={{ x: 165, duration: 300 }}>
      <button id="filterBtn" on:click={onFilterButtonClick}>➤<br />筛<br />选</button>
    </div>
  {/if}

  <div id="bottomDiv" />

  <div id="map" style="width: {mapW}px; height: {mapH - 70 + 1}px; background-color: #222222;" />

  <Modal
    visible={addPointVisability}
    top="15%"
    title={editMode ? '修改 ' + currentClickedMarker?.name : '添加一个地标'}
    zindex={114600}
    showOkButton
    showCloseButton
    okButtonText={editMode ? '修改' : '添加'}
    closeButtonText="取消"
    onOKButtonClick={onAdd}
    onCloseButtonClick={onClose}
  >
    <div class="modalInner">
      <button
        on:click={() => {
          selectTypeVisability = true;
        }}
        >{selectTypes.filter(type => {
          return type.value === addedPointType;
        })?.[0]?.name || '——选择类型——'}</button
      >
      <div id="underSelector">
        <button
          class={!addedPointUnderground && 'active'}
          on:click={() => {
            addedPointUnderground = false;
          }}>地面</button
        ><button
          class={addedPointUnderground && 'active'}
          on:click={() => {
            addedPointUnderground = true;
          }}>地下</button
        >
      </div>
      <input type="text" placeholder="名称 (1～20)" bind:value={addedPointName} />
      <textarea placeholder="描述 (0～1000)" bind:value={addedPointDesc} />
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
  #searchTextContainer {
    border: solid 1px rgb(208, 200, 181);
    box-shadow: 0 0 3px 0 rgb(208, 200, 181);
    background-color: rgb(21, 22, 17);
    color: rgb(208, 200, 181);
    font-family: 'Times New Roman', Times, serif;
    display: flex;
    width: 200px;
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
    left: 155px;
    z-index: 114514;
    align-self: center;
  }
  #filterDiv {
    position: absolute;
    top: 70px;
    left: 0px;
    width: 160px;
    z-index: 114515;
    align-self: center;
    border: solid 1px rgb(208, 200, 181);
    box-shadow: 0 0 2px 0 white;
    background-color: rgb(21, 22, 17, 0.7);
    color: rgb(208, 200, 181);
  }
  #filter {
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.7em;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 400px;
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
  .modalInner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 40px;
  }
  .modalInner p {
    color: rgb(208, 200, 181);
  }
  #selectModalInner {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
  #underSelector {
    width: -webkit-fill-available;
    display: flex;
  }
  #underSelector button {
    width: -webkit-fill-available;
  }
  .checkbox {
  }
  input[type='checkbox']::after {
    background-color: #f5cc95;
  }
</style>
