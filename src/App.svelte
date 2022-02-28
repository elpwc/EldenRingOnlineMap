<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router/router';
  import { link } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';
  import { currentPageStore } from './stores';

  let currentPage: string = 'home';
  currentPageStore.subscribe(v => {
    currentPage = v;
  });
</script>

<div style="height: 100%; ">
  <nav class="menu">
    <a href="/map" use:link>
      {#if currentPage === 'map'}
        <div class="backgroundLight" transition:fade />
      {/if}
      <img src="./resource/icons/map.png" alt="mapicon" width="50px" />
      <span>地图</span>
    </a>
    <a href="/apothegm" use:link>
      {#if currentPage === 'apothegm'}
        <div class="backgroundLight" transition:fade />
      {/if}<img src="./resource/icons/apothegm.png" alt="mapicon" width="50px" /><span>讯息</span></a
    >
    <a href="/about" use:link>
      {#if currentPage === 'about'}
        <div class="backgroundLight" transition:fade />
      {/if}<img src="./resource/icons/about.png" alt="mapicon" width="50px" /><span>说明</span></a
    >
  </nav>
  <main style="height: calc( 100% - 70px );">
    <Router {routes} />
  </main>
</div>

<style>
  .backgroundLight {
    box-shadow: 0px 80px 30px 30px rgb(144 139 123);
  }
  .menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: #171715;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    z-index: 600;
    box-shadow: 0 0 5px 0 black;
  }
  .menu a {
    width: -webkit-fill-available;
    text-align: center;
    color: rgb(208, 200, 181);
    text-decoration-line: none;
    font-family: 'Times New Roman', Times, serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-shadow: 0 0 5px black;
  }
  .menu a img {
    padding: 0px;
  }
</style>
