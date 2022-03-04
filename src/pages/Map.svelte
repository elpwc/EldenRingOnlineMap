<script lang="ts">
  /**
   * 地图页
   * 但内容几乎全写到MapView里了
   * 算了就这样吧，懒得改了，能跑就行
   */
  import MapView from '../components/MapView.svelte';
  import { onMount } from 'svelte';
  import { currentPageStore } from '../stores';

  onMount(() => {
    currentPageStore.set('map');
  });
</script>

<div class="container">
  <MapView />
</div>

<style>
  .container {
    display: flex;
    height: 100%;
    width: 100%;
  }
</style>
