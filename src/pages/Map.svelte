<script lang="ts">
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
