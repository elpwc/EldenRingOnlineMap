<script lang="ts">
  /**
   * 地图页
   * 但内容几乎全写到MapView里了
   * 算了就这样吧，懒得改了，能跑就行
   */
  import MapView from '../components/MapView.svelte';
  import { onMount } from 'svelte';
  import { querystring, location } from 'svelte-spa-router';
  import qs from 'qs';

  let params;

  onMount(() => {
    querystring.subscribe(v => {
      // 路径参数：是否禁用拖动而采用方向按钮控制，适用于一些移动app的引用
      params = qs.parse(v);
    });
  });

  // 去掉地图页原始右键菜单
  document.oncontextmenu = function () {
    if ($location === '/') {
      return false;
    }
  };
</script>

<div class="container">
  <MapView from={params?.from} device={params?.device} />
</div>

<style>
  .container {
    display: flex;
    height: 100%;
    width: 100%;
  }
</style>
