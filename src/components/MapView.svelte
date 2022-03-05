<script lang="ts">
  import L from 'leaflet';
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { fly } from 'svelte/transition';
  import { MapPointType } from '../utils/enum';
  import axios from 'axios';
  import { ip, isAdminModeStore } from '../stores';
  import type { MapPoint } from '../utils/typings';
  import { MapIcon } from './icons';
  import './icons.css';
  import { getCookie, setCookie } from '../utils/utils';
import filters from '../utils/siteTypes';

  /** 本页面！唯一指定！地图对象！ */
  let map;

  /** 是否在管理员模式喵 */
  let isAdminMode = false;

  isAdminModeStore.subscribe(v => {
    isAdminMode = v;
  });

  // 初始化地图宽高
  /** 地图div宽度 */
  let mapW = window.innerWidth;
  /** 地图div高度 */
  let mapH = window.innerHeight;

  /** 添加地标Modal */
  let addPointVisability = false;
  /** 选择地标类型Modal */
  let selectTypeVisability = false;

  /** 是否处于添加地标模式，此模式会显示一个临时的地表点在地图上 */
  let isAddPointMode = false;

  /** 左侧筛选栏是否打开了 */
  let showfilterDiv = false;

  /** 当前按下的点的经纬 */
  let currentClickedlatLng;

  /** 要加的点的类型 */
  let addedPointType: MapPointType = MapPointType.Empty;
  /** 要加的点的名称 */
  let addedPointName = '';
  /** 要加的点的描述 */
  let addedPointDesc = '';
  /** 要加的点在不在地下 */
  let addedPointUnderground = false;

  /** 搜索的词 */
  let searchWord = '';

  /** 选中的筛选栏选项 */
  let checkedTypes: string[] = [];
  /** 是否显示地标名字 */
  let showPlaceNames = true;
  /** 是否显示地下 0 全部显示，1 显示地下，2 显示地表 */
  let undergroundStatus = 0;
  /** 左侧栏筛选文本（未使用 */
  let filterString = '';
  /** 是否显示自己添加的地标 */
  let showSelf = false;

  /** 是否全选 */
  let selectAll = false;

  /** 所有地标 */
  let markers: { marker: L.Marker; id: number }[] = [];
  /** 搜索到的所有地标 */
  let searchResultMarkers = [];
  /** 收藏的所有地标 */
  let collectMarkers = [];
  /** 添加地标时显示的临时地标 */
  let tempMarker;

  /** 是否在搜索模式中 */
  let isSearch = false;

  /** 是否显示收藏 */
  let showCollect = true;

  /** 当前打开的地标 */
  let currentClickedMarker: MapPoint;
  /** 地标详情Modal */
  let markerInfoVisibility = false;

  /** 删除确认框 */
  let deleteConfirmVisibility = false;

  /** 是否在编辑地标模式 */
  let editMode = false;

  /** 所有收藏的地标的id */
  let collects = getCookie('collect')?.split('|');

  onMount(() => {
    // 初始化地图参数
    let initZoom = 2;
    let initLat = 40;
    let initLng = -40;

    // 从cookie读取上次关闭时的地图状态
    if (getCookie('zoom')) {
      initZoom = Number(getCookie('zoom'));
    }
    if (getCookie('centerlat')) {
      initLat = Number(getCookie('centerlat'));
    }
    if (getCookie('centerlng')) {
      initLng = Number(getCookie('centerlng'));
    }

    // 创建地图
    map = L.map('map', { attributionControl: false, zoomControl: false, maxBounds: L.latLngBounds(L.latLng(-100, -200), L.latLng(100, 100)) }).setView([initLat, initLng], initZoom);

    // 获取老头环地图数据
    L.tileLayer('https://imgs.ali213.net/picfile/eldenring/{z}/{x}/{y}.jpg', {
      maxZoom: 7,
      minZoom: 2,
      tileSize: 200,
      zoomOffset: 0,
    }).addTo(map);

    // 把缩放控件加到左下角
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // 地图点击事件
    map.on('click', e => {
      if (isAddPointMode) {
        // 如果在添加地标模式中
        currentClickedlatLng = e.latlng;
        tempMarker = L.marker(e.latlng, {
          icon: L.divIcon(MapIcon.default()(addedPointName)),
        });
        tempMarker.addTo(map);
        addPointVisability = true;
      }
    });

    // 地图缩放/移动结束后储存状态
    map.on('zoomend', e => {
      setCookie('zoom', map?.getZoom());
      setCookie('centerlat', map?.getCenter().lat);
      setCookie('centerlng', map?.getCenter().lng);
    });

    map.on('moveend', e => {
      setCookie('zoom', map?.getZoom());
      setCookie('centerlat', map?.getCenter().lat);
      setCookie('centerlng', map?.getCenter().lng);
    });

    // 加载坐标
    loadMarkers();

    // 如果默认选择了显示收藏，在这里加载
    if (showCollect) {
      refreshCollectedMarkers();
    }
  });

  // 地图大小随窗口变化
  window.addEventListener('resize', e => {
    mapW = window.innerWidth;
    mapH = window.innerHeight;
  });

  /** 从服务器根据收藏的坐标的id读取数据 */
  const refreshCollectedMarkers = () => {
    if (showCollect) {
      // 如果要显示收藏
      if (collects.length > 0) {
        // 是否cookie里有收藏
        collectMarkers.forEach(marker => {
          marker.remove();
        });
        collectMarkers = [];
        collects.forEach(co => {
          const collectId = Number(co);
          if (collectId > 0) {
            axios
              .get('./map.php', {
                params: {
                  id: collectId,
                },
              })
              .then(res => {
                console.log(res.data);
                const m = res.data?.[0];
                collectMarkers.push(L.marker(L.latLng(m.lat, m.lng) /*, { icon: L.divIcon(MapIcon.collect()()) }*/));
                collectMarkers.push(
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

                // 把收藏的原始标准，和大一点的显眼标注加进去（正好是倒数两个
                collectMarkers[collectMarkers.length - 1].addTo(map);
                collectMarkers[collectMarkers.length - 2].addTo(map);
              });
          }
        });
      }
    } else {
      // 如果不显示收藏
      collectMarkers.forEach(marker => {
        marker.remove();
      });
      collectMarkers = [];
    }
  };

  /**
   * 加载地标
   * @param id 指定加载的id，不填的话加载所有
   */
  const loadMarkers = (id: number = 0) => {
    if (id > 0) {
      // 加载指定id
      axios
        .get('./map.php', {
          params: { id },
        })
        .then(res => {
          console.log(res.data);

          /** 加载到的坐标数据 */
          const resMarker: MapPoint = (res.data as MapPoint[])?.[0];
          // 从地图上去掉旧的同id坐标
          markers
            .filter(f => {
              return f.id === id;
            })?.[0]
            .marker.remove();

          // 更新同id坐标
          markers[
            markers.findIndex(f => {
              return f.id === id;
            })
          ].marker = L.marker(L.latLng(resMarker.lat, resMarker.lng), {
            icon: L.divIcon(
              (
                filters.filter(filter => {
                  return filter?.value === resMarker.type;
                })?.[0]?.icon as (title?: string) => {
                  html: string;
                  className: string;
                }
              )?.(showPlaceNames ? resMarker.name : '')
            ),
          }).on('click', () => {
            currentClickedMarker = resMarker;
            markerInfoVisibility = true;
          });

          // 把新的坐标加到地图上
          markers
            .filter(f => {
              return f.id === id;
            })[0]
            .marker.addTo(map);
        });
    } else {
      // 加载全部
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
            marker.marker.remove();
          });
          markers = [];
          res.data.forEach((m: MapPoint) => {
            markers.push({
              marker: L.marker(L.latLng(m.lat, m.lng), {
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
              }),
              id: m.id,
            });
          });

          markers.forEach(marker => {
            marker.marker.addTo(map);
          });
        });
    }
  };

  /** 搜索地标 */
  const onSearch = () => {
    if (searchWord !== '') {
      isSearch = true;
      // 先把搜索内容存一下
      axios.post('./searchUpload.php', {
        content: searchWord,
        ip,
        position: 'map',
      });

      // 获取搜索结果
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
                markerInfoVisibility = true;
              })
            );
          });

          searchResultMarkers.forEach(marker => {
            marker.addTo(map);
          });
        });
    }
  };

  // 进入添加地标模式
  const onAddButtonClick = () => {
    isAddPointMode = !isAddPointMode;
  };

  // 添加/编辑地标
  const onAdd = () => {
    if (addedPointName !== '' && addedPointType !== MapPointType.Empty) {
      if (addedPointName.length <= 20 && addedPointDesc.length <= 1000) {
        //判断是编辑还是新增
        if (editMode) {
          // 编辑
          axios
            .patch('./map.php', {
              id: currentClickedMarker?.id,
              type: addedPointType,
              name: addedPointName,
              desc: addedPointDesc,
              is_underground: addedPointUnderground ? '1' : '0',
            })
            .then(res => {
              console.log(res);
              addPointVisability = false;
              editMode = false;

              // 清除Modal已输入内容
              addedPointDesc = '';
              addedPointName = '';
              addedPointType = MapPointType.Empty;
              addedPointUnderground = false;
              loadMarkers(currentClickedMarker?.id);
            });
        } else {
          // 添加
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

              // 清除Modal已输入内容
              addedPointDesc = '';
              addedPointName = '';
              addedPointType = MapPointType.Empty;
              addedPointUnderground = false;
              tempMarker.remove();
              loadMarkers(/*res.data?.id*/);
            });
        }
      } else {
        alert('名字(≤20)/描述(≤1000)太长了~');
      }
    } else {
      alert('请填写名字/选择类型再提交~');
    }
  };

  /** 关闭添加地标Modal */
  const onClose = () => {
    addPointVisability = false;
    addedPointDesc = '';
    addedPointName = '';
    addedPointType = MapPointType.Empty;
    addedPointUnderground = false;
    tempMarker.remove();
  };

  /** 打开筛选框按钮按下时 */
  const onFilterButtonClick = () => {
    showfilterDiv = !showfilterDiv;
  };

  /** 好评 */
  const onLike = () => {
    axios
      .patch('./map.php', {
        id: currentClickedMarker?.id,
        like: Number(currentClickedMarker?.like) + 1,
      })
      .then(res => {
        currentClickedMarker.like = Number(currentClickedMarker?.like) + 1;
        loadMarkers(currentClickedMarker?.id);
      });
  };

  /** 恶评 */
  const onDislike = () => {
    axios
      .patch('./map.php', {
        id: currentClickedMarker?.id,
        dislike: Number(currentClickedMarker?.dislike) + 1,
      })
      .then(res => {
        currentClickedMarker.dislike = Number(currentClickedMarker?.dislike) + 1;
        loadMarkers(currentClickedMarker?.id);
      });
  };

  /** 删除地标 */
  const onDelete = () => {
    axios
      .delete('./map.php', {
        data: {
          id: currentClickedMarker?.id,
        },
      })
      .then(res => {
        markerInfoVisibility = false;
        markers
          .filter(f => {
            return f.id === currentClickedMarker?.id;
          })?.[0]
          ?.marker.remove();
        markers = markers.filter(f => {
          return f.id !== currentClickedMarker?.id;
        });
        currentClickedMarker = undefined;
      });
  };

  /** 筛选栏的checkbox更改后 */
  const onFilterCheckChange = e => {
    // 判断更改的value，如果是functional的话，单独拎出来处理
    switch (e.target.value) {
      case 'self':
        showSelf = e.target.checked;
        break;
      case 'all':
        selectAll = e.target.checked;
        break;
      case 'collect':
        showCollect = e.target.checked;
        refreshCollectedMarkers();
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
    // 重新加载
    loadMarkers();
  };

  /** 锁定地标 */
  const onSetLockChecked = e => {
    axios.patch('./map.php', { id: currentClickedMarker?.id, is_lock: e.target.checked ? '1' : '0' }).then(res => {
      currentClickedMarker.is_lock = e.target.checked;
      loadMarkers(currentClickedMarker?.id);
    });
  };

  /** 添加地标的选择类型的Modal里的各个类型按钮的事件喵 */
  const onFilterModalClick = (value: string) => {
    addedPointType = value as MapPointType;
    selectTypeVisability = false;
  };
</script>

<div>
  <header id="topDiv">
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
              loadMarkers();
            }}>{searchResultMarkers.length / 2}个结果, 点此清除结果</button
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
  </header>

  <!--左侧筛选栏-->
  {#if showfilterDiv}
    <div id="filterDiv" transition:fly={{ x: -160, duration: 300 }}>
      <p style="font-size: 0.6em;">地图上点地标可以查看详细</p>
      <div id="filter" style="max-height: {window.innerHeight - 80}px;">
        {#each filters as filter}
          {#if filter?.hr}
            <p class="filterHr"><span>——</span><span>{filter.name}</span><span>——</span></p>
          {:else}
            <label
              ><input
                class="checkbox"
                type="checkbox"
                value={filter.value}
                checked={filter?.functional
                  ? (() => {
                      switch (filter?.value) {
                        case 'self':
                          return showSelf;
                        case 'all':
                          return selectAll;
                        case 'collect':
                          return showCollect;
                        default:
                          return false;
                      }
                    })()
                  : checkedTypes.includes(filter.value)}
                on:change={onFilterCheckChange}
              />{filter.name}
            </label>
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
  <!--筛选栏结束-->

  <div id="bottomDiv" />

  <!--地图本体喵-->
  <!--mapH+1是因为....是因为........反正不加的话就会空出一条白线呜！-->
  <div id="map" style="width: {mapW}px; height: {mapH - 70 + 1}px; background-color: #222222;" />
</div>

<!--删除确认Modal-->
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

<!--地标详细信息-->
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
    <p style="min-height: 80px; width: fit-content; max-height: {window.innerHeight * 0.4}px; overflow-y: scroll; text-shadow: 0 0 20px black;">
      {@html currentClickedMarker?.desc?.replaceAll('\n', '<br />')}
    </p>
    <div style="display: flex;">
      <button on:click={onLike}>{`给予好评 ${currentClickedMarker?.like}`}</button>
      <button on:click={onDislike}>{`给予恶评 ${currentClickedMarker?.dislike}`}</button>
    </div>

    <div>
      {#if !currentClickedMarker?.is_lock || isAdminMode}
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

      {#if (!currentClickedMarker?.is_lock && currentClickedMarker?.ip === ip) || isAdminMode}
        <button
          on:click={() => {
            deleteConfirmVisibility = true;
          }}>删除</button
        >
      {/if}
      <button
        on:click={() => {
          if (collects?.includes(String(currentClickedMarker?.id))) {
            setCookie(
              'collect',
              collects
                .filter(f => {
                  return f !== String(currentClickedMarker?.id);
                })
                .join('|')
            );
          } else {
            collects.push(String(currentClickedMarker?.id));
            setCookie('collect', collects.join('|'));
          }
          collects = getCookie('collect')?.split('|');

          refreshCollectedMarkers();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
          />
        </svg>
        {collects?.includes(String(currentClickedMarker?.id)) ? '取消收藏' : '收藏'}</button
      >
      {#if isAdminMode}
        <label style="color: rgb(208, 200, 181);"><input type="checkbox" checked={currentClickedMarker?.is_lock} on:change={onSetLockChecked} />锁定</label>
      {/if}
    </div>
  </div>
</Modal>

<!--添加/编辑地标Modal-->
<Modal
  visible={addPointVisability}
  top="10%"
  width="85%"
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
    <button
      on:click={() => {
        selectTypeVisability = true;
      }}
      >{filters.filter(type => {
        return type.value === addedPointType;
      })?.[0]?.name || '——选择类型——'}</button
    >
    <input type="text" placeholder="名称 (1～20)" bind:value={addedPointName} />
    <textarea placeholder="描述 (0～1000)" bind:value={addedPointDesc} />
  </div>
</Modal>

<!--添加/编辑Modal里的选择类型Modal-->
<Modal visible={selectTypeVisability} top="5%" title="选择类型" zindex={1919810} width="{window.innerWidth * 0.8}px " backgroundOpacity={0.8}>
  <div id="selectModalInner">
    {#each filters as filter}
      {#if filter?.hr}
        <p class="filterHrInModal"><span>——————</span><span>{filter.name}</span><span>——————</span></p>
      {:else if !filter?.functional}
        <button
          class="filterButtonInModal"
          on:click={() => {
            onFilterModalClick(filter.value);
          }}>{filter.name}</button
        >
      {/if}
    {/each}
  </div>
</Modal>

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
  }

  .filterHr {
    align-self: center;
    color: #f5cc95;
  }
  .filterHrInModal {
    align-self: center;
    color: #f5cc95;
    width: -webkit-fill-available;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 5px;
  }
  .filterButtonInModal {
    font-size: 1em;
    padding: 5px 10px;
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
  .modalInner input {
    font-size: 1.1em;
    padding: 5px 0;
  }
  .modalInner button {
    font-size: 1.1em;
    padding: 5px 13px;
  }
  .modalInner textarea {
  }
  .modalInner p {
    color: rgb(251 241 218);
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
