<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageStore } from '../stores';
  onMount(() => {
    currentPageStore.set('apothegm');
  });

  
</script>

<div class="container">
  <div>
	  开发中
	  Developping
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100%;
    width: 100%;
    background-color: rgb(21, 22, 17);
    color: rgb(208, 200, 181);
  }
</style>
