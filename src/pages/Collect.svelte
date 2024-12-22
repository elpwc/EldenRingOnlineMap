<script lang="ts">
  import { collectionSet } from '../stores';
  import { getSiteTypeFilters } from '../utils/filters';
  import { t } from 'svelte-i18n';
  import axios from 'axios';
  import * as config from '../config';
  import { testdata } from '../utils/testdata';

  $: filters = getSiteTypeFilters($t);

  interface CollectContainer {
    collect;
    isLocal: boolean;
    type: string;
  }

  /** 所有收藏的地标的id */
  const F_collectionsSet = collectionSet.getStore();
  const collections = Array.from($F_collectionsSet);
  let markers = [];

  const getAllMarkers = async () => {
    return await axios
      .get('./map.php', {
        params: {
          type: '',
          kword: '',
          ip: '',
          mapType: 3,
          /*
            x1: map.getBounds().getSouthWest().lat,
            y1: map.getBounds().getSouthWest().lng,
            x2: map.getBounds().getNorthEast().lat,
            y2: map.getBounds().getNorthEast().lng,
            */
        },
      })
      .then(res => {
        if (config.default.useTestData) {
          return testdata;
        } else {
          if (res?.data && Array.isArray(res?.data)) {
            return res?.data;
          } else {
            alert($t('map.alert.maperror'));
          }
        }
      });
  };

  /** 收藏的所有地标 */
  let collectMarkersData: CollectContainer[] = [];

  const getAllCollectsFromLocal = () => {
    collections.forEach(id => {
      if (id > 0) {
        const m = markers.find(f => {
          return f.id === id;
        });
        if (m) {
          const type = filters.filter(f => {
            return f.value === m.type;
          })[0];
          collectMarkersData.push({ collect: m, isLocal: true, type: (type.emoji ?? '') + type.name });
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
  };

  const init = async () => {
    markers = await getAllMarkers();
    getAllCollectsFromLocal();
    collectMarkersData = collectMarkersData;
  };

  init();

  const handleRowClick = row => {};

  const handleDelete = i => {};

  const handleLocate = row => {};
</script>

<div class="container">
  <header>
    <button>
      {$t('collect.table.saveToServer')}
    </button>
  </header>
  <table>
    <thead>
      <tr>
        <th class="type-col">{$t('collect.table.type')}</th>
        <th>{$t('collect.table.name')}</th>
        <th class="savePlace-col">{$t('collect.table.savePlace')}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each collectMarkersData as collectMarkerData, index}
        <tr>
          <td class="type-col">{collectMarkerData.type}</td>
          <td on:click={() => handleRowClick(collectMarkerData)}>{collectMarkerData.collect.name}</td>
          <td class="savePlace-col">{collectMarkerData.isLocal ? '💻' + $t('collect.table.local') : '☁' + $t('collect.table.server')}</td>
          <td>
            <div class="button-group">
              <button on:click={() => handleDelete(index)}>{$t('collect.table.delete')}</button>
              <button on:click={() => handleLocate(collectMarkerData)}>{$t('collect.table.locate')}</button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    height: 100%;
    width: 100%;
    text-align: center;
  }
  .container p {
    color: rgb(208, 200, 181);
    min-width: fit-content;
    margin-right: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    color: rgb(208, 200, 181);
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th.type-col,
  td.type-col {
    width: 40px; /* 控制 type 列的宽度 */
    text-align: center;
  }

  th.savePlace-col,
  td.savePlace-col {
    width: 80px; /* 控制 savePlace 列的宽度 */
  }

  tr:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }

  .button-group {
    display: flex;
    gap: 5px;
  }

  button {
    padding: 4px 8px;
    cursor: pointer;
  }
</style>
