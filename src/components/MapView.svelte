<script lang="ts">
  import L, { LeafletMouseEvent } from 'leaflet';
  import { afterUpdate, onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { fly } from 'svelte/transition';
  import { MapPointType, PointPosition } from '../utils/enum';
  import axios from 'axios';
  import { allMarkers, collectionSet, hiddenSet, ip, isAdminModeStore, isMobile, setAllMarkers } from '../stores';
  import type { MapPoint } from '../utils/typings';
  import { MapIcon } from './icons';
  import './icons.css';
  import { getCookie, setCookie } from '../utils/utils';
  import DirectionControl from './MapViewComponents/DirectionControl.svelte';
  import { getConvertedText, getKeywordText } from '../utils/convertor';
  import { t } from 'svelte-i18n';
  import { getSiteTypeFilters } from '../utils/filters';
  import zhConvertor from 'zhconvertor';
  import jQuery from 'jquery';
  import RightMenu from './MapViewComponents/RightMenu.svelte';

  /** 是否禁用拖动而采用方向按钮控制，适用于一些移动app的引用 */
  export let from: string = '';
  /** 设备来源 */
  export let device: string = '';

  let filters = getSiteTypeFilters($t);

  // 地图数据
  /** 地表地图数据源 */
  const groundMap: string = 'https://imgs.ali213.net/picfile/eldenring/{z}/{x}/{y}.jpg';
  /** 地下地图数据源 */
  const undergroundMap: string = 'https://imgs.ali213.net/picfile/eldenring_dx/{z}/{x}/{y}.png'; // './resource/maps/underground/{z}/{x}/{y}.jpg';

  /** 本页面！唯一指定！地图对象！喵！ */
  let map: L.Map;

  // 初始化地图宽高
  /** 地图div宽度 */
  let mapW: number = window.innerWidth;
  /** 地图div高度 */
  let mapH: number = window.innerHeight;

  /** 添加地标Modal */
  let addPointVisability: boolean = false;
  /** 选择地标类型Modal */
  let selectTypeVisability: boolean = false;

  /** 是否处于添加地标模式，此模式会显示一个临时的地表点在地图上 */
  let isAddPointMode: boolean = false;

  /** 左侧筛选栏是否打开了 */
  let showfilterDiv: boolean = true; // 默认打开

  /** 当前左侧栏tip */
  let leftBarTipIndex: number = 0;

  /** 当前按下的点的经纬 */
  let currentClickedlatLng: L.LatLng;

  /** 要加的点的类型 */
  let addedPointType: MapPointType = MapPointType.Empty;
  /** 要加的点的名称 */
  let addedPointName: string = '';
  /** 要加的点的描述 */
  let addedPointDesc: string = '';
  /** 要加的点的地表位置 */
  let addedPointPosition: PointPosition = PointPosition.Surface;

  /** 搜索的词 */
  let searchWord: string = '';

  /** 选中的筛选栏选项 */
  let checkedTypes: string[] = ['cifu', 'portal', 'soulsite', 'map', 'bigboss', 'boss', 'guhui', 'text', 'warn', 'question', 'taoke'];
  // let checkedTypes: string[] = [];

  /** 是否显示地标名字 */
  let showPlaceNames: boolean = true;
  /** 是否显示地下 0 全部显示，1 显示地下，2 显示地表 */
  let is_underground: boolean = false;
  /** 地表显示模式 [地表, 洞穴, 灰城] */
  let current_position: [boolean, boolean, boolean] = [true, true, false];
  /** 左侧栏筛选文本（未使用 */
  let filterString: string = '';
  /** 是否显示自己添加的地标 */
  let showSelf: boolean = false;

  /** 是否全选 */
  let selectAll: boolean = false;

  /** 所有地标 */
  let markers: { marker: L.Marker; id: number; ins: MapPoint }[] = [];
  /** 搜索到的所有地标 */
  let searchResultMarkers: L.Marker[] = [];
  /** 收藏的所有地标 */
  let collectMarkers: L.Marker[] = [];
  /** 添加地标时显示的临时地标 */
  let tempMarker: L.Marker;

  /** 是否在搜索模式中 */
  let isSearch: boolean = false;

  /** 是否显示收藏 */
  let showCollect: boolean = true;

  /** 当前打开的地标 */
  let currentClickedMarker: MapPoint;
  /** 地标详情Modal */
  let markerInfoVisibility: boolean = false;

  /** 当前右键菜单的地标 */
  let currentMenuedMarker: MapPoint;
  /** 是否展示右键菜单 */
  let showMenu: boolean = false;
  /** 右键菜单X */
  let clientX = 0;
  /** 右键菜单Y */
  let clientY = 0;

  /** 删除确认框 */
  let deleteConfirmVisibility: boolean = false;

  /** 是否在一个地标的编辑模式,注意：不是添加地标模式(isAddPointMode) */
  let editMode: boolean = false;

  /** 所有收藏的地标的id */
  let collections = collectionSet.getStore();

  /** 是否修改了地标位置 */
  let isUpdateLnglatMode: boolean = false;

  /** 是否显示隐藏的地标 */
  let show_hidden: boolean = false;

  /** 所有隐藏的地标的id */
  let hiddens = hiddenSet.getStore();

  /** 地图字体大小 */
  let markerFontSize: number = 0.8;

  /** 隐藏恶评 > 好评的 */
  let hideBad: boolean = false;

  /** 筛选栏宽度 */
  let filterBarWidth = '';

  /** 等待响应 */
  let isWaitingForResponse = false;

  let groundLayer: L.Layer;
  let undergroundLayer: L.Layer;

  /** 刷新左侧栏tip */
  const refreshLeftBarTipIndex = () => {
    leftBarTipIndex = Math.floor(Math.random() * $t('map.left.tips').split('|').length);
  };

  /** 全选所有筛选选项 */
  const freshSelectAll = () => {
    checkedTypes = [];
    checkedTypes = filters
      .filter(f => {
        return f.functional === undefined && f.hr === undefined;
      })
      .map(f => {
        return f.value;
      });
  };

  /** 根据选中情况更新全选状态 */
  const freshSelectAllStatus = () => {
    if (
      filters.filter(f => {
        return f.functional === undefined && f.hr === undefined;
      })?.length === checkedTypes.length
    ) {
      selectAll = true;
    } else {
      selectAll = false;
    }
  };

  /** 获取筛选栏自适应宽度 */
  const getFilterBarWidth = () => {
    filterBarWidth = jQuery('#filterDiv').css('width');
  };

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

    // 若窗口方向转换，更新filterbar宽度，以让按钮位置匹配
    getFilterBarWidth();
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
    if (getCookie('hidebad')) {
      hideBad = getCookie('hidebad') === '1';
    }
    if (getCookie('checkedTypes') !== undefined) {
      checkedTypes = getCookie('checkedTypes')
        .split('|')
        .filter(f => {
          return f !== '' && f !== undefined;
        });
    }

    // 初始化是否显示地名，zoom过小就不显示了，不然嫩卡
    if (initZoom > 3) {
      showPlaceNames = true;
    } else {
      showPlaceNames = false;
    }

    // 初始化全选
    if (selectAll) {
      freshSelectAll();
    }
    freshSelectAllStatus();

    // 创建地图
    map = L.map('map', { attributionControl: false, zoomControl: false, maxBounds: L.latLngBounds(L.latLng(-100, -200), L.latLng(100, 100)) }).setView([initLat, initLng], initZoom);

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

    L.control
      .attribution({
        position: 'bottomright',
        prefix: `
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-lightbulb-fill" viewBox="0 0 16 16">
      <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5z"/>
    </svg>
    ${$t('map.bottom.developerAndProvider')}: 
    <a href="https://github.com/elpwc" target="_blank">wniko</a>
    |
    <a href="https://www.elpwc.com/eldenringmap/#/about">
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
        <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
      </svg>
      ${$t('map.bottom.donate')}
    </a>
    `,
      })
      .addTo(map);

    // 地图点击事件
    map.on('click', (e: L.LeafletMouseEvent) => {
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

    map.on('mousedown', () => {
      // 其他地方点击时 关闭右键菜单
      showMenu = false;
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
      } else if (map?.getZoom() > 3 && lastZoom <= 3 && !showPlaceNames) {
        showPlaceNames = true;
      }

      updateShowingMarkers();
    });

    map.on('moveend', e => {
      setCookie('zoom', map?.getZoom());
      setCookie('centerlat', map?.getCenter().lat);
      setCookie('centerlng', map?.getCenter().lng);

      updateShowingMarkers();
    });

    // 加载坐标
    refreshAllMarkers(0, () => {
      // 如果默认选择了显示收藏，在这里加载
      // 先加载坐标，再加载收藏
      if (showCollect) {
        refreshCollectedMarkers();
      }
    });

    getFilterBarWidth();

    refreshLeftBarTipIndex();
  });
  // onMount 结束=============================================================

  // 地图大小随窗口变化
  window.addEventListener('resize', e => {
    mapW = window.innerWidth;
    mapH = window.innerHeight;
  });

  // 鼠标位置
  window.addEventListener('mousedown', e => {
    if (e.button === 2) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
  });

  /** 从本地的Marker中删除一个Marker */
  const delFromLoadedMarkers = (id: number) => {
    setAllMarkers(
      allMarkers.filter(f => {
        return f.id !== id;
      })
    );
  };

  /** 从服务端更新markers, 只在启动时全部读取一次，之后只通过id更新单个 */
  const refreshAllMarkers = (id?: number, onGet?: () => void) => {
    if (id && id > 0) {
      // 加载指定id
      axios
        .get('./map.php', {
          params: { id, queryType: 0 },
        })
        .then(res => {
          const index = allMarkers.findIndex(i => {
            return i.id === id;
          });

          if (index > -1) {
            allMarkers[index] = res?.data?.[0];
          } else {
            allMarkers.push(res?.data?.[0]);
          }

          updateShowingMarkers(id);
        });
    } else {
      // 加载全部
      axios
        .get('./map.php', {
          params: {
            type: selectAll ? '' : checkedTypes.length === 0 || (checkedTypes.length === 1 && checkedTypes[0] === '') ? 'none' : checkedTypes.join('|'),
            kword: searchWord,
            ip: showSelf ? ip : '',
            under: is_underground ? 1 : 2,
            queryPosition: current_position.join('|'),
            queryType: 0,
          },
        })
        .then(res => {
          if (res?.data && Array.isArray(res?.data)) {
            setAllMarkers(res?.data);
            updateShowingMarkers();

            onGet?.();
          } else {
            alert($t('map.alert.maperror'));
          }
        });
    }
  };

  /** 从服务器根据收藏的坐标的id读取数据 */
  const refreshCollectedMarkers = () => {
    if (showCollect) {
      // 如果要显示收藏
      if ($collections.size > 0) {
        collectMarkers.forEach(marker => {
          marker.remove();
        });
        collectMarkers = [];
        $collections.forEach(id => {
          if (id > 0) {
            const m = allMarkers.find(f => {
              return f.id === id;
            });
            if (m) {
              collectMarkers.push(L.marker(L.latLng(m.lat, m.lng) /*, { icon: L.divIcon(MapIcon.collect()()) }*/));
              collectMarkers.push(getMarker(m));

              // 把收藏的原始标准，和大一点的显眼标注加进去（正好是倒数两个
              if (m.is_underground === is_underground) {
                collectMarkers[collectMarkers.length - 1].addTo(map);
                collectMarkers[collectMarkers.length - 2].addTo(map);
              }
            }

            /*
            axios
              .get('./map.php', {
                params: {
                  id: collectId,
                },
              })
              .then(res => {
                // console.log(res.data);
                const m: MapPoint = res.data?.[0];
                collectMarkers.push(L.marker(L.latLng(m.lat, m.lng) /*, { icon: L.divIcon(MapIcon.collect()()) }*));
                collectMarkers.push(getMarker(m));

                // 把收藏的原始标准，和大一点的显眼标注加进去（正好是倒数两个
                if (m.is_underground === is_underground) {
                  collectMarkers[collectMarkers.length - 1].addTo(map);
                  collectMarkers[collectMarkers.length - 2].addTo(map);
                }
              });
              */
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
   * 根据服务器返回的MapPoint获取L.Marker
   * @param marker
   */
  const getMarker = (marker: MapPoint) => {
    const typeInfo = filters.filter(filter => {
      return filter?.value === marker.type;
    })?.[0];
    return L.marker(L.latLng(marker.lat, marker.lng), {
      icon: L.divIcon(
        (
          typeInfo?.icon as (
            title?: string,
            fontSize?: string
          ) => {
            html: string;
            className: string;
            iconSize: L.Point;
            iconArchor: L.Point;
          }
        )?.((typeInfo.emoji === undefined ? '' : typeInfo.emoji) + (showPlaceNames ? getConvertedText(marker.name) : ''), `${markerFontSize}em`)
      ),
    })
      .on('click', () => {
        // 在添加的时候不能误点了(取消了， 因为被太多人反应是个bug乌乌明明不是)
        //if (!isAddPointMode) {
        currentClickedMarker = marker;
        markerInfoVisibility = true;
        //}
      })
      .on('contextmenu', (e: LeafletMouseEvent) => {
        // 右键菜单
        currentMenuedMarker = marker;
        clientX = e.originalEvent.clientX;
        clientY = e.originalEvent.clientY;
        showMenu = true;
      });
  };

  /**
   * 渲染地标
   * @param id 指定渲染的id，不填的话加载所有
   */
  const updateShowingMarkers = (id: number = 0) => {
    if (id > 0) {
      // 加载指定id
      /** 加载到的坐标数据 */
      const resMarker: MapPoint = allMarkers.filter(f => {
        return f.id === id;
      })?.[0];
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
      ].marker = getMarker(resMarker);

      // 如果没隐藏的
      if (show_hidden || !(show_hidden || $hiddens.has(resMarker.id))) {
        // 把新的坐标加到地图上
        markers
          .filter(f => {
            return f.id === id;
          })[0]
          .marker.addTo(map);
      }
    } else {
      // 加载全部
      markers.forEach(marker => {
        marker.marker.remove();
      });
      markers = [];
      allMarkers.forEach((m: MapPoint) => {
        if ((map as L.Map).getBounds().contains(L.latLng(m.lat, m.lng))) {
          markers.push({
            marker: getMarker(m),
            id: m.id,
            ins: m,
          });
        }
      });

      markers.forEach(marker => {
        if (
          // 过滤掉隐藏的
          (show_hidden || !(show_hidden || $hiddens.has(marker.id))) &&
          // 过滤掉恶评>好评的
          ((hideBad && marker.ins.like >= marker.ins.dislike) || marker.ins.type === 'cifu' || !hideBad)
        ) {
          marker.marker.addTo(map);
        }
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
            kword: getKeywordText(searchWord),
            queryType: 0,
          },
        })
        .then(res => {
          // console.log(res.data);
          searchResultMarkers.forEach(marker => {
            marker.remove();
          });
          searchResultMarkers = [];
          res.data.forEach((m: MapPoint) => {
            searchResultMarkers.push(L.marker(L.latLng(m.lat, m.lng)));
            searchResultMarkers.push(getMarker(m));
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
    // 判断是否在等待响应
    if (isWaitingForResponse) {
      alert($t('map.alert.uploading'));
    } else {
      if (addedPointName !== '' && addedPointType !== MapPointType.Empty) {
        if (addedPointName.length <= 20 && addedPointDesc.length <= 1000) {
          //判断是编辑还是新增
          if (editMode) {
            isWaitingForResponse = true;
            // 编辑
            axios
              .patch('./map.php', {
                ...{
                  id: currentClickedMarker?.id,
                  type: addedPointType,
                  name: addedPointName,
                  desc: addedPointDesc,
                  position: addedPointPosition,
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
                addPointVisability = false;
                editMode = false;
                isUpdateLnglatMode = false;

                // 清除Modal已输入内容
                addedPointDesc = '';
                addedPointName = '';
                addedPointType = MapPointType.Empty;
                addedPointPosition = PointPosition.Surface;
                tempMarker?.remove();
                refreshAllMarkers(res.data?.id);
              })
              .finally(() => {
                isWaitingForResponse = false;
              });
          } else {
            // 名字可以重复的地表类型
            const repeatableTypes = [
              MapPointType.GoldenSeed,
              MapPointType.ImportantItem,
              MapPointType.Item,
              MapPointType.Key,
              MapPointType.Wind,
              MapPointType.Temple,
              MapPointType.Stone,
              MapPointType.ShengbeiLudi,
              MapPointType.Map,
              MapPointType.Material,
              MapPointType.Orchid,
              MapPointType.Text,
              MapPointType.Warn,
              MapPointType.Taoke,
              MapPointType.Question,
            ];
            // 判断是否重复
            let existflag = false;
            for (let i = 0; i < allMarkers.length; i++) {
              if (zhConvertor.t2s(allMarkers[i].name) === zhConvertor.t2s(addedPointName) && !repeatableTypes.includes(addedPointType)) {
                existflag = true;
                break;
              }
            }

            let confirmres = false;
            if (existflag) {
              confirmres = confirm($t('map.alert.repeat'));
            }
            if (!existflag || (existflag && confirmres)) {
              isWaitingForResponse = true;
              // 添加
              axios
                .post('./map.php', {
                  type: addedPointType,
                  name: addedPointName,
                  desc: addedPointDesc,
                  position: addedPointPosition,
                  lng: currentClickedlatLng.lng,
                  lat: currentClickedlatLng.lat,
                  is_underground: is_underground ? '1' : '2',
                  like: 0,
                  dislike: 0,
                  ip,
                })
                .then(res => {
                  // console.log(res);
                  addPointVisability = false;

                  // 清除Modal已输入内容
                  addedPointDesc = '';
                  addedPointName = '';
                  addedPointType = MapPointType.Empty;

                  addedPointPosition = PointPosition.Surface;
                  tempMarker.remove();
                  refreshAllMarkers(res.data?.id);
                })
                .finally(() => {
                  isWaitingForResponse = false;
                });
            }
          }
        } else {
          alert($t('map.alert.exceeded'));
        }
      } else {
        alert($t('map.alert.empty'));
      }
    }
  };

  /** 关闭添加地标Modal */
  const onClose = () => {
    addPointVisability = false;
    addedPointDesc = '';
    addedPointName = '';
    addedPointType = MapPointType.Empty;
    addedPointPosition = PointPosition.Surface;
    editMode = false;
    tempMarker.remove();
  };

  /** 打开筛选框按钮按下时 */
  const onFilterButtonClick = () => {
    refreshLeftBarTipIndex();

    showfilterDiv = !showfilterDiv;
    setCookie('filterBarOpen', showfilterDiv ? '1' : '0');
  };

  /** 好评 */
  const onLike = () => {
    axios
      .patch('./map.php', {
        id: currentClickedMarker?.id,
        like: 0,
      })
      .then(res => {
        currentClickedMarker.like = Number(currentClickedMarker?.like) + 1;
        refreshAllMarkers(currentClickedMarker?.id);
      });
  };

  /** 恶评 */
  const onDislike = () => {
    axios
      .patch('./map.php', {
        id: currentClickedMarker?.id,
        dislike: 0,
      })
      .then(res => {
        currentClickedMarker.dislike = Number(currentClickedMarker?.dislike) + 1;
        refreshAllMarkers(currentClickedMarker?.id);
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
        delFromLoadedMarkers(currentClickedMarker?.id);
        updateShowingMarkers();
        currentClickedMarker = undefined;
      });
  };

  /** 筛选栏的checkbox更改后 */
  const onFilterCheckChange = e => {
    // 变一下tip
    refreshLeftBarTipIndex();

    // 判断更改的value，如果是functional的话，单独拎出来处理
    switch (e.target.value) {
      case 'self':
        showSelf = e.target.checked;
        refreshAllMarkers();
        break;
      case 'all':
        selectAll = e.target.checked;
        if (selectAll) {
          freshSelectAll();
        } else {
          checkedTypes = [];
        }
        refreshAllMarkers();
        // 储存选中状态
        setCookie('checkedTypes', checkedTypes.join('|'));
        break;
      case 'collect':
        showCollect = e.target.checked;
        refreshCollectedMarkers();
        break;
      case 'hide':
        show_hidden = e.target.checked;
        updateShowingMarkers();
        break;
      case 'hidebad':
        hideBad = e.target.checked;
        if (hideBad) {
          alert($t('siteTypes.functionalFilters.hideBadTip'));
        }
        setCookie('hidebad', hideBad ? '1' : '0');
        updateShowingMarkers();
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
        refreshAllMarkers();

        // 儲存cookie
        setCookie('checkedTypes', checkedTypes.join('|'));

        // 更改后更新全选状态
        freshSelectAllStatus();

        break;
    }
  };

  /** 锁定地标 */
  const onSetLockChecked = e => {
    axios.patch('./map.php', { id: currentClickedMarker?.id, is_lock: e.target.checked ? '1' : '0' }).then(res => {
      currentClickedMarker.is_lock = e.target.checked;
      updateShowingMarkers(currentClickedMarker?.id);
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

  /**
   * 隐藏/取消隐藏一个地标
   * @param id
   */
  const hideMarker = (id: number) => {
    if ($hiddens.has(id)) {
      hiddens.removePoint(id);
    } else {
      hiddens.addPoint(id);
    }
    updateShowingMarkers(id);
  };

  /** 收藏/取消收藏一个地标 */
  const collectMarker = (id: number) => {
    if ($collections.has(id)) {
      collections.removePoint(id);
    } else {
      collections.addPoint(id);
    }
    refreshCollectedMarkers();
  };

  /** 打开一个地标的编辑窗口 */
  const showEditModal = (currentClickedMarker: MapPoint) => {
    addedPointDesc = currentClickedMarker?.desc;
    addedPointName = currentClickedMarker?.name;
    addedPointType = currentClickedMarker?.type;
    addedPointPosition = currentClickedMarker?.position;

    markerInfoVisibility = false;
    editMode = true;

    // 在改变地点时点开别的编辑就退出改变地点模式
    if (isUpdateLnglatMode) {
      isUpdateLnglatMode = false;
    }

    addPointVisability = true;
  };
</script>

<!--右键菜单-->
{#if showMenu}
  <RightMenu
    x={clientX}
    y={clientY}
    title={getConvertedText(currentMenuedMarker.name)}
    onHide={() => {
      hideMarker(currentMenuedMarker.id);
      showMenu = false;
    }}
    onCollect={() => {
      collectMarker(currentMenuedMarker.id);
      showMenu = false;
    }}
    onEdit={() => {
      showEditModal(currentMenuedMarker);
      showMenu = false;
    }}
    isHidden={$hiddens.has(currentMenuedMarker.id)}
    isCollected={$collections.has(currentMenuedMarker.id)}
  />
{/if}

<div>
  <header id="topDiv">
    {#if !isAddPointMode}
      <div id="searchTextContainer">
        <input type="text" style="border: none; width: 80%; box-shadow: none;" placeholder={$t('map.topright.placeholder')} bind:value={searchWord} />
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
              refreshAllMarkers();
            }}
            >{$t('map.topright.result').replace('{result}', String(searchResultMarkers.length / 2))}
          </button>
        {/if}
      </div>
      <button on:click={onSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
          />
        </svg>
        {$t('map.topright.search')}
      </button>
    {:else}
      <p id="addpointtip">{isUpdateLnglatMode ? $t('map.topright.changePositionModeHint') : $t('map.topright.editModeHint')}</p>
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
        {isAddPointMode ? $t('map.topright.editModeBtn') : $t('map.topright.add')}
      </p>
    </button>
  </header>

  <!--左侧筛选栏-->
  {#if showfilterDiv}
    <div id="filterDiv" transition:fly={{ x: -160, duration: 300 }}>
      <div id="underSelector" style="font-size: 0.9em; margin: 5px; align-items: center;">
        <button
          id="undergroundSwitchButton"
          on:click={() => {
            // 变一下tip
            refreshLeftBarTipIndex();

            is_underground = !is_underground;
            refreshAllMarkers();
            refreshCollectedMarkers();
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
          {is_underground ? $t('map.left.undergroundSwitcher2') : $t('map.left.undergroundSwitcher1')}
        </button>
        <button on:click={onFilterButtonClick} id="leftInnerCloseButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>

      <!--地表切换显示-->
      {#if !is_underground}
        <div id="underSelector" style="font-size: 0.9em; margin: 5px; align-items: center;">
          <button
            on:click={() => {
              current_position[0] = !current_position[0];
              refreshAllMarkers();
            }}
          >
            {current_position[0] ? '☑ ' : '☐ '}
            {$t('map.left.surface')}
          </button>
          <button
            on:click={() => {
              current_position[1] = !current_position[1];
              refreshAllMarkers();
            }}
          >
            {current_position[1] ? '☑ ' : '☐ '}
            {$t('map.left.cave')}
          </button>
          <button
            on:click={() => {
              current_position[2] = !current_position[2];
              refreshAllMarkers();
            }}
          >
            {current_position[2] ? '☑ ' : '☐ '}
            {$t('map.left.afterBurning')}
          </button>
        </div>
      {/if}

      <p style="font-size: 0.6em;">tips: {$t('map.left.tips').split('|')[leftBarTipIndex]}</p>

      <div id="filter" style="min-height: {mapH * 0.4}px;max-height: {mapH}px; height: {mapH - 300}px;">
        {#each filters as filter}
          {#if filter?.hr}
            <p class="filterHr"><span>——</span><span>{filter.name}</span><span>——</span></p>
          {:else}
            <label>
              <input
                class="checkbox"
                type="checkbox"
                value={filter.value}
                checked={filter?.functional
                  ? (() => {
                      // 这里控制筛选栏checkbox的初始状态
                      switch (filter?.value) {
                        case 'self':
                          return showSelf;
                        case 'all':
                          return selectAll;
                        case 'collect':
                          return showCollect;
                        case 'hide':
                          return show_hidden;
                        case 'hidebad':
                          return hideBad;
                        default:
                          return false;
                      }
                    })()
                  : checkedTypes.includes(filter.value)}
                on:change={onFilterCheckChange}
              />
              {filter.name}
            </label>
          {/if}
        {/each}
      </div>
      <button
        id="showNameBtn"
        class={showPlaceNames && 'checked'}
        on:click={() => {
          showPlaceNames = !showPlaceNames;
          updateShowingMarkers();
        }}
      >
        {$t('map.left.showNameButton')}{showPlaceNames ? ' √' : ''}
      </button>
      <div id="underSelector" style="margin: 5px; align-items: center;">
        <span style="min-width: fit-content;">{$t('map.left.fontSizeLabel')}</span>
        <button
          class={markerFontSize === 0.5 && 'checked'}
          on:click={() => {
            markerFontSize = 0.5;
            updateShowingMarkers();
          }}
        >
          {$t('map.left.fontSizeSmall')}
        </button>

        <button
          class={markerFontSize === 0.8 && 'checked'}
          on:click={() => {
            markerFontSize = 0.8;
            updateShowingMarkers();
          }}
        >
          {$t('map.left.fontSizeMedium')}
        </button>

        <button
          class={markerFontSize === 1.3 && 'checked'}
          on:click={() => {
            markerFontSize = 1.3;
            updateShowingMarkers();
          }}
        >
          {$t('map.left.fontSizeLarge')}
        </button>
      </div>
      <!--input type="text" placeholder="关键词" bind:value={filterString}/-->
    </div>
    <div id="leftDiv2" style="left: {filterBarWidth};" in:fly={{ x: -165, duration: 300 }} out:fly={{ x: -165, duration: 300 }}>
      <button id="filterBtn" on:click={onFilterButtonClick}>◀<br />{@html $t('map.left.buttonAfterOpen')}</button>
    </div>
  {:else}
    <div id="leftDiv" in:fly={{ x: 165, duration: 300 }} out:fly={{ x: 165, duration: 300 }}>
      <button id="filterBtn" on:click={onFilterButtonClick}>➤<br />{@html $t('map.left.buttonBeforeOpen')}</button>
    </div>
  {/if}
  <!--筛选栏结束-->

  <div id="bottomDiv">
    <!--移动控件-->
    {#if from === 'dodo' && device === 'ios'}
      <DirectionControl
        style="margin-right: 10px;"
        onClick={direction => {
          /** 移动前的中心 */
          const currentCenter = map.getCenter();
          /** 增量 */
          const increment = (10 / map.getZoom()) ** 2.3;
          switch (direction) {
            case 'up':
              map.setView([currentCenter.lat + increment, currentCenter.lng]);
              break;
            case 'bottom':
              map.setView([currentCenter.lat - increment, currentCenter.lng]);
              break;
            case 'left':
              map.setView([currentCenter.lat, currentCenter.lng - increment]);
              break;
            case 'right':
              map.setView([currentCenter.lat, currentCenter.lng + increment]);
              break;
            default:
              break;
          }
        }}
      />
    {/if}
  </div>

  <!--地图本体喵-->
  <!--mapH+1是因为....是因为........反正不加的话就会空出一条白线呜！-->
  <div id="map" style="width: {mapW}px; height: {mapH - 60 + 1}px; background-color: #222222;" />
</div>

<!--删除确认Modal-->
<Modal
  visible={deleteConfirmVisibility}
  top="30%"
  zindex={114700}
  showOkButton
  showCloseButton
  okButtonText={$t('map.modals.delete.btn1')}
  closeButtonText={$t('map.modals.delete.btn2')}
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
  width="85%"
  visible={markerInfoVisibility}
  top="5%"
  title={filters.filter(filter => {
    return filter.value === currentClickedMarker?.type;
  })?.[0]?.name +
    ': ' +
    getConvertedText(currentClickedMarker?.name)}
  zindex={114600}
  showOkButton
  okButtonText={$t('map.modals.info.btn1')}
  onOKButtonClick={() => {
    markerInfoVisibility = false;
  }}
>
  <div class="modalInner" style="align-items: center;">
    <p style="min-height: 80px; width: fit-content; max-height: {window.innerHeight * 0.4}px; overflow-y: scroll; text-shadow: 0 0 20px black; overflow-wrap: anywhere;">
      {@html getConvertedText(currentClickedMarker?.desc?.replaceAll('\n', '<br />'))}
    </p>
    <div style="display: flex;">
      <button on:click={onLike}>{$t('map.modals.info.like') + currentClickedMarker?.like}</button>
      <button on:click={onDislike}>{$t('map.modals.info.dislike') + currentClickedMarker?.dislike}</button>
    </div>

    <div>
      {#if !currentClickedMarker?.is_lock || $isAdminModeStore}
        <!--编辑按钮-->
        <button
          on:click={() => {
            showEditModal(currentClickedMarker);
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
          {$t('map.modals.info.edit')}
        </button>
      {/if}

      {#if (!currentClickedMarker?.is_lock && currentClickedMarker?.ip === ip) || $isAdminModeStore}
        <!--删除按钮-->
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
          {$t('map.modals.info.delete')}
        </button>
      {/if}
      <!--收藏 / 取消收藏-->
      <button
        on:click={() => {
          collectMarker(currentClickedMarker?.id);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
          />
        </svg>
        {$collections.has(currentClickedMarker?.id) ? $t('map.modals.info.uncollect') : $t('map.modals.info.collect')}
      </button>
      <label style="color: rgb(208, 200, 181);">
        <input
          type="checkbox"
          checked={$hiddens.has(currentClickedMarker?.id)}
          on:change={() => {
            // 隐藏
            hideMarker(currentClickedMarker?.id);
          }}
        />
        {$t('map.modals.info.hide')}
      </label>

      {#if $isAdminModeStore}
        <!--锁定-->
        <label style="color: rgb(208, 200, 181);"><input type="checkbox" checked={currentClickedMarker?.is_lock} on:change={onSetLockChecked} />{$t('map.modals.info.lock')}</label>
      {/if}
    </div>
  </div>
</Modal>

<!--添加/编辑地标Modal-->
<Modal
  visible={addPointVisability}
  top="0%"
  width="85%"
  title={editMode ? $t('map.modals.add.editModeTitle').replace('{title}', currentClickedMarker?.name) : $t('map.modals.add.title')}
  zindex={114600}
  showOkButton
  showCloseButton
  okButtonText={isWaitingForResponse ? $t('map.modals.add.btn1Uploading') : editMode ? $t('map.modals.add.btn1EditMode') : $t('map.modals.add.btn1')}
  closeButtonText={$t('map.modals.add.btn2')}
  onOKButtonClick={onAdd}
  onCloseButtonClick={onClose}
>
  <div class="modalInner">
    <div id="underSelector">
      <button
        class={!is_underground && 'checked'}
        on:click={() => {
          is_underground = false;
          refreshAllMarkers();
        }}
      >
        {$t('map.modals.add.surface')}
      </button>
      <button
        class={is_underground && 'checked'}
        on:click={() => {
          is_underground = true;
          refreshAllMarkers();
        }}
      >
        {$t('map.modals.add.underground')}
      </button>
    </div>

    <!--选择地面-洞穴-灰城按钮组-->
    {#if !is_underground}
      <div id="underSelector">
        <button
          on:click={() => {
            addedPointPosition = PointPosition.Surface;
          }}
          class={addedPointPosition === PointPosition.Surface && 'active'}
        >
          {addedPointPosition === PointPosition.Surface ? '☑ ' : '☐ '}
          {$t('map.modals.add.surfaceItem')}
        </button>

        <button
          on:click={() => {
            addedPointPosition = PointPosition.Cave;
          }}
          class={addedPointPosition === PointPosition.Cave && 'active'}
        >
          {addedPointPosition === PointPosition.Cave ? '☑ ' : '☐ '}
          {$t('map.modals.add.cave')}
        </button>

        <button
          on:click={() => {
            addedPointPosition = PointPosition.AfterBurning;
          }}
          class={addedPointPosition === PointPosition.AfterBurning && 'active'}
        >
          {addedPointPosition === PointPosition.AfterBurning ? '☑ ' : '☐ '}
          {$t('map.modals.add.afterBurning')}
        </button>
      </div>
    {/if}

    <button
      on:click={() => {
        selectTypeVisability = true;
      }}
    >
      {filters.filter(type => {
        return type.value === addedPointType;
      })?.[0]?.name || `——${$t('map.modals.add.selector')}——`}
    </button>

    <input type="text" placeholder="{$t('map.modals.add.namePlaceHolder')} (1～20)" bind:value={addedPointName} />

    <textarea placeholder="{$t('map.modals.add.descPlaceHolder')} (0～1000)" bind:value={addedPointDesc} />

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
      {$t('map.modals.add.reposition')}
    </button>

    {#if !editMode}
      <p>※{$t('map.modals.add.addTip1')}</p>
      <p>※{$t('map.modals.add.addTip2')}</p>
    {/if}
  </div>
</Modal>

<!--添加/编辑Modal里的选择类型Modal-->
<Modal visible={selectTypeVisability} top="0%" title={$t('map.modals.add.selector')} zindex={1919810} width="{window.innerWidth * 0.8}px " backgroundOpacity={0.8}>
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
    writing-mode: horizontal-tb;
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
    border-radius: 0 5px 5px 0;
    border-left: none !important;
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
    left: 0px;
    z-index: 114514;
    align-self: center;
  }
  #leftDiv2 {
    position: absolute;
    top: 100px;
    z-index: 114514;
    align-self: center;
  }
  #filterDiv {
    position: absolute;
    top: 50px;
    left: 0px;
    width: fit-content;
    max-width: 100%;
    z-index: 114515;
    align-self: center;
    border: solid 1px rgb(208, 200, 181);
    box-shadow: 0 0 2px 0 white;
    background-color: rgb(21, 22, 17, 0.85);
    color: rgb(208, 200, 181);
    min-height: max-content;
  }
  #filter {
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.7em;
    display: flex;
    flex-wrap: wrap;
    writing-mode: vertical-lr;
    overflow-x: scroll;
    width: 100%;
  }
  #filter label {
    margin: 1px 0px !important;
    writing-mode: horizontal-tb;
  }
  #bottomDiv {
    position: absolute;
    bottom: 90px;
    left: 50%;
    right: 0;
    z-index: 114514;
    align-self: center;
    margin-top: 20px;
    display: flex;
    justify-content: end;
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
  #leftInnerCloseButton {
    border: none;
    width: min-content !important;
    transition: all 0.2s;
    padding: 0;
    height: 16px;
    box-shadow: none;
    margin: 5px;
  }
  @media (any-hover: hover) {
    #leftInnerCloseButton:hover {
      transform: rotate(45deg);
    }
  }

  #leftInnerCloseButton:active {
    transform: rotate(-45deg);
  }
</style>
