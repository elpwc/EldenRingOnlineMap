<script lang="ts">
  import L, { CanvasIconLayer, marker } from 'leaflet';
  import { afterUpdate, onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { fly } from 'svelte/transition';
  import { MapPointType } from '../utils/enum';
  import axios from 'axios';
  import { ip, isAdminModeStore, isMobile } from '../stores';
  import type { MapPoint } from '../utils/typings';
  import { MapIcon } from './icons';
  import './icons.css';
  import { getCookie, setCookie } from '../utils/utils';
  import filters from '../utils/siteTypes';
  //import 'leaflet-markers-canvas';
  import 'leaflet-canvas-marker';

  // 地图数据
  /** 地表地图数据源 */
  const groundMap = 'https://imgs.ali213.net/picfile/eldenring/{z}/{x}/{y}.jpg';
  /** 地下地图数据源 */
  const undergroundMap = './resource/maps/underground/{z}/{x}/{y}.jpg';

  /** 本页面！唯一指定！地图对象！喵！ */
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
  let showfilterDiv = true; // 默认打开

  /** 当前按下的点的经纬 */
  let currentClickedlatLng;

  /** 要加的点的类型 */
  let addedPointType: MapPointType = MapPointType.Empty;
  /** 要加的点的名称 */
  let addedPointName = '';
  /** 要加的点的描述 */
  let addedPointDesc = '';

  /** 搜索的词 */
  let searchWord = '';

  /** 选中的筛选栏选项 */
  let checkedTypes: string[] = [];
  /** 是否显示地标名字 */
  let showPlaceNames = true;
  /** 是否显示地下 0 全部显示，1 显示地下，2 显示地表 */
  let is_underground = false;
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

  /** 是否在一个地标的编辑模式,注意：不是添加地标模式(isAddPointMode) */
  let editMode = false;

  /** 所有收藏的地标的id */
  let collects = getCookie('collect')?.split('|');

  /** 是否修改了地标位置 */
  let isUpdateLnglatMode = false;

  /** 是否显示隐藏的地标 */
  let show_hidden = false;
  /** 所有隐藏的地标的id */
  let hidden = getCookie('hidden')?.split('|');

  /** 地图字体大小 */
  let markerFontSize = 0.8;

  let groundLayer: L.Layer;
  let undergroundLayer: L.Layer;

  afterUpdate(() => {
    if (is_underground) {
      setCookie('underground', '1');
      groundLayer.remove();
      undergroundLayer.addTo(map);
    } else {
      setCookie('underground', '0');
      undergroundLayer.remove();
      groundLayer.addTo(map);
    }
  });

  onMount(() => {
    // 初始化地图参数
    let initZoom = 3;
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
    if (getCookie('filterBarOpen')) {
      showfilterDiv = getCookie('filterBarOpen') === '1';
    }
    if (getCookie('underground')) {
      is_underground = getCookie('underground') === '1';
    }

    // 初始化是否显示地名，zoom过小就不显示了，不然嫩卡
    if (initZoom > 3) {
      showPlaceNames = true;
    } else {
      showPlaceNames = false;
    }

    // 创建地图
    map = L.map('map', { attributionControl: false, zoomControl: false, maxBounds: L.latLngBounds(L.latLng(-100, -200), L.latLng(100, 100)) }).setView([initLat, initLng], initZoom);

    //const markerLayer = new L.MarkersCanvas();
    //markerLayer.addTo(map);

    const markerLayer = L.canvasIconLayer();
    markerLayer.addTo(map).addOnClickListener((e, ret) => {
      console.log('clicked: ',ret);
    })
    
    markerLayer.addMarker(
      L.marker([0, 0], {
        icon: L.icon({
          iconUrl: './resource/icons/boss.png',
          iconSize: [50, 50],
          iconAnchor: [0, 0],
        }),
      }).on('click', () => {
        alert(114514);
      }),
      '114514',
      {
        normal: {
          font: '15px',
          color: 'white',
          borderColor: 'black',
          borderWidth: 2
        }
      }
    );

    groundLayer = L.tileLayer(groundMap, {
      maxZoom: 7,
      minZoom: 2,
      tileSize: 200,
      zoomOffset: 0,
    });

    undergroundLayer = L.tileLayer(undergroundMap, {
      maxZoom: 7,
      minZoom: 2,
      tileSize: 200,
      zoomOffset: 0,
    });

    // 把缩放控件加到左下角
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // 地图点击事件
    map.on('click', e => {
      if (isAddPointMode) {
        // 如果在添加地标模式中
        tempMarker?.remove();
        currentClickedlatLng = e.latlng;
        tempMarker = L.marker(e.latlng, {
          icon: L.divIcon(MapIcon.default()(addedPointName, `${markerFontSize}em`)),
        });
        tempMarker.addTo(map);
        addPointVisability = true;
      }
    });

    /** 上次缩放等级，用来比对是不是2级，是2级的话，就不加载地名了，不然太卡力 */
    let lastZoom = 3;

    map.on('zoomstart', e => {
      lastZoom = map?.getZoom();
    });

    // 地图缩放/移动结束后储存状态
    map.on('zoomend', e => {
      setCookie('zoom', map?.getZoom());
      setCookie('centerlat', map?.getCenter().lat);
      setCookie('centerlng', map?.getCenter().lng);

      if (map?.getZoom() <= 3 && lastZoom > 3 && showPlaceNames) {
        showPlaceNames = false;
        loadMarkers();
      } else if (map?.getZoom() > 3 && lastZoom <= 3 && !showPlaceNames) {
        showPlaceNames = true;
        loadMarkers();
      }
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
                        })?.[0]?.icon as (
                          title?: string,
                          fontSize?: string
                        ) => {
                          html: string;
                          className: string;
                        }
                      )?.(showPlaceNames ? m.name : '', `${markerFontSize}em`)
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
                })?.[0]?.icon as (
                  title?: string,
                  fontSize?: string
                ) => {
                  html: string;
                  className: string;
                }
              )?.(showPlaceNames ? resMarker.name : '', `${markerFontSize}em`)
            ),
          }).on('click', () => {
            // 在添加的时候不能误点了(取消了， 因为被太多人反应是个bug乌乌明明不是)
            //if (!isAddPointMode) {
            currentClickedMarker = resMarker;
            markerInfoVisibility = true;
            //}
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
            under: is_underground ? 1 : 2,
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
                    })?.[0]?.icon as (
                      title?: string,
                      fontSize?: string
                    ) => {
                      html: string;
                      className: string;
                    }
                  )?.(showPlaceNames ? m.name : '', `${markerFontSize}em`)
                ),
              }).on('click', () => {
                //if (!isAddPointMode) {
                currentClickedMarker = m;
                markerInfoVisibility = true;
                //}
              }),
              id: m.id,
            });
          });

          markers.forEach(marker => {
            // 过滤掉隐藏的
            if (show_hidden || !(show_hidden || hidden?.includes(marker.id.toString()))) {
              marker.marker.addTo(map);
            }
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
                    })?.[0]?.icon as (
                      title?: string,
                      fontSize?: string
                    ) => {
                      html: string;
                      className: string;
                    }
                  )?.(showPlaceNames ? m.name : '', `${markerFontSize}em`)
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
    if (isUpdateLnglatMode) {
      isUpdateLnglatMode = false;
    }
    if (editMode) {
      editMode = false;
    }
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
              ...{
                id: currentClickedMarker?.id,
                type: addedPointType,
                name: addedPointName,
                desc: addedPointDesc,
                is_underground: is_underground ? '1' : '0',
              },
              ...(isUpdateLnglatMode
                ? {
                    lng: currentClickedlatLng.lng,
                    lat: currentClickedlatLng.lat,
                  }
                : {}),
            })
            .then(res => {
              console.log(res);
              addPointVisability = false;
              editMode = false;
              isUpdateLnglatMode = false;

              // 清除Modal已输入内容
              addedPointDesc = '';
              addedPointName = '';
              addedPointType = MapPointType.Empty;
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
              is_underground: is_underground ? '1' : '2',
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
    editMode = false;
    tempMarker.remove();
  };

  /** 打开筛选框按钮按下时 */
  const onFilterButtonClick = () => {
    showfilterDiv = !showfilterDiv;
    setCookie('filterBarOpen', showfilterDiv ? '1' : '0');
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
      case 'hide':
        show_hidden = e.target.checked;
        loadMarkers();
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
    if (
      filters.filter(f => {
        return f.value === (value as MapPointType);
      })?.[0]?.noname
    ) {
      addedPointName = filters.filter(f => {
        return f.value === (value as MapPointType);
      })?.[0]?.name;
    }
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
      <button on:click={onSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
          />
        </svg>
        搜索
      </button>
    {:else}
      <p id="addpointtip">{isUpdateLnglatMode ? '在地图点击选择新的位置' : '在地图上点击一点添加坐标'}</p>
    {/if}

    <button id="addPointButton" on:click={onAddButtonClick}>
      {#if !isAddPointMode}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
          />
        </svg>
      {/if}
      <p>
        {isAddPointMode ? '退出编辑' : '添加地标'}
      </p>
    </button>
  </header>

  <!--左侧筛选栏-->
  {#if showfilterDiv}
    <div id="filterDiv" transition:fly={{ x: -160, duration: 300 }}>
      <button
        id="undergroundSwitchButton"
        on:click={() => {
          is_underground = !is_underground;
          loadMarkers();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
          <path
            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
          />
          <path
            fill-rule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          />
        </svg>
        切换到{is_underground ? '地面' : '地下'}地图
      </button>
      <p style="font-size: 0.6em;">tips:点击地图上的地标可以查看详细</p>
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
        class={showPlaceNames && 'checked'}
        on:click={() => {
          showPlaceNames = !showPlaceNames;
          loadMarkers();
        }}
      >
        显示地名{showPlaceNames ? ' √' : ''}
      </button>
      <div id="underSelector" style="margin: 5px; align-items: center;">
        <span style="min-width: fit-content;">字号</span>
        <button
          class={markerFontSize === 0.5 && 'checked'}
          on:click={() => {
            markerFontSize = 0.5;
            loadMarkers();
          }}
        >
          小
        </button>

        <button
          class={markerFontSize === 0.8 && 'checked'}
          on:click={() => {
            markerFontSize = 0.8;
            loadMarkers();
          }}
        >
          中
        </button>

        <button
          class={markerFontSize === 1.3 && 'checked'}
          on:click={() => {
            markerFontSize = 1.3;
            loadMarkers();
          }}
        >
          大
        </button>
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
  width="75%"
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

            markerInfoVisibility = false;
            editMode = true;
            addPointVisability = true;
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path
              d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
            />
            <path
              fill-rule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
          编辑</button
        >
      {/if}

      {#if (!currentClickedMarker?.is_lock && currentClickedMarker?.ip === ip) || isAdminMode}
        <button
          on:click={() => {
            deleteConfirmVisibility = true;
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
            <path
              d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
            />
          </svg>
          删除</button
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
      <label style="color: rgb(208, 200, 181);">
        <input
          type="checkbox"
          checked={hidden?.includes(String(currentClickedMarker?.id))}
          on:change={() => {
            // 隐藏
            if (hidden?.includes(String(currentClickedMarker?.id))) {
              setCookie(
                'hidden',
                hidden
                  .filter(f => {
                    return f !== String(currentClickedMarker?.id);
                  })
                  .join('|')
              );
            } else {
              hidden.push(String(currentClickedMarker?.id));
              setCookie('hidden', hidden.join('|'));
            }
            hidden = getCookie('hidden')?.split('|');
          }}
        />
        隐藏
      </label>

      {#if isAdminMode}
        <label style="color: rgb(208, 200, 181);"><input type="checkbox" checked={currentClickedMarker?.is_lock} on:change={onSetLockChecked} />锁定</label>
      {/if}
    </div>
  </div>
</Modal>

<!--添加/编辑地标Modal-->
<Modal
  visible={addPointVisability}
  top="0%"
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
        class={!is_underground && 'checked'}
        on:click={() => {
          is_underground = false;
          loadMarkers();
        }}
      >
        位于地面
      </button>
      <button
        class={is_underground && 'checked'}
        on:click={() => {
          is_underground = true;
          loadMarkers();
        }}
      >
        位于地下(希芙拉河)
      </button>
    </div>
    <button
      on:click={() => {
        selectTypeVisability = true;
      }}
    >
      {filters.filter(type => {
        return type.value === addedPointType;
      })?.[0]?.name || '——选择类型——'}
    </button>
    <input type="text" placeholder="名称 (1～20)" bind:value={addedPointName} />
    <textarea placeholder="描述 (0～1000)" bind:value={addedPointDesc} />
    <button
      on:click={() => {
        isAddPointMode = true;
        addPointVisability = false;
        isUpdateLnglatMode = true;
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-map-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z" />
        <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z" />
      </svg>
      重新选择位置
    </button>
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
    margin-left: 5px;
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
    width: -webkit-fill-available;
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
    top: 50px;
    left: 0px;
    width: 160px;
    z-index: 114515;
    align-self: center;
    border: solid 1px rgb(208, 200, 181);
    box-shadow: 0 0 2px 0 white;
    background-color: rgb(21, 22, 17, 0.7);
    color: rgb(208, 200, 181);
    min-height: max-content;
  }
  #filter {
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.7em;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 425px;
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
    margin-left: 5px;
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
    justify-content: center;
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
  #undergroundSwitchButton {
    margin: 5px;
    font-size: 0.9em;
    width: -webkit-fill-available;
  }
</style>
