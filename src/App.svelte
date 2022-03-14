<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router/router';
  import { currentPageStore } from './stores';
  import MenuItem from './components/MenuItem.svelte';

  let currentPage: string = 'map';
  currentPageStore.subscribe(v => {
    currentPage = v;
  });

  const menuItems = [
    { url: '/', pageName: 'map', text: '地图', imgSrc: './resource/images/map.png' },
    { url: '/apothegm', pageName: 'apothegm', text: '讯息', imgSrc: './resource/images/apothegm.png' },
    { url: '/general', pageName: 'general', text: '我的(开发中)', imgSrc: './resource/images/apothegm.png' },
    { url: '/about', pageName: 'about', text: '说明', imgSrc: './resource/images/about.png' },
  ];
</script>

<div style="height: 100%; ">
  <!--菜单栏-->
  <nav class="menu">
    {#each menuItems as item}
      <MenuItem {currentPage} {...item} />
    {/each}
  </nav>

  <!--所有页面-->
  <main style="height: calc( 100% - 70px );">
    <Router {routes} />
  </main>
</div>

<style>
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
</style>
