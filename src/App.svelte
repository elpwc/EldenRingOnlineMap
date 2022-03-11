<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router/router';
  import { link } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';
  import { currentPageStore } from './stores';

  let currentPage: string = 'map';
  currentPageStore.subscribe(v => {
    currentPage = v;
  });
</script>

<div style="height: 100%; ">
  <!--菜单栏-->
  <nav class="menu">
    <a href="/" use:link>
      {#if currentPage === 'map'}
        <div class="backgroundLight" transition:fade />
      {/if}
      <img src="./resource/images/map.png" alt="mapicon" width="40px" />
      <span>地图</span>
    </a>
    <a href="/apothegm" use:link>
      {#if currentPage === 'apothegm'}
        <div class="backgroundLight" transition:fade />
      {/if}<img src="./resource/images/apothegm.png" alt="mapicon" width="40px" />
      <span>讯息</span>
    </a>
    <a href="/general" use:link>
      {#if currentPage === 'general'}
        <div class="backgroundLight" transition:fade />
      {/if}<img src="./resource/images/apothegm.png" alt="mapicon" width="40px" />
      <span>我的(开发中)</span>
    </a>
    <a href="/about" use:link>
      {#if currentPage === 'about'}
        <div class="backgroundLight" transition:fade />
      {/if}<img src="./resource/images/about.png" alt="mapicon" width="40px" />
      <span>说明</span>
    </a>
  </nav>

  <!--所有页面-->
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
    box-shadow: 0 0 30px 0 #54524a;
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
    user-select: none;
    transition: all 0.3s;
  }
  .menu a img {
    padding: 0px;
    user-select: none;
  }
  .menu a span {
    padding: 4px 0;
  }
  @media (any-hover: hover) {
    .menu a:hover {
      background-color: #1e1e1c;
    }
  }
</style>
