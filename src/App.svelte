<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router/router';
  import { currentPageStore, langStore } from './stores';
  import MenuItem from './components/MenuItem.svelte';
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import { getCookie } from './utils/utils';
  import getLang from './utils/lang';
  import type zhcnLang from './locale/zhcn';

  let currentPage: string = 'map';
  currentPageStore.subscribe(v => {
    currentPage = v;
  });

  /** 语言 */
  let Lang: typeof zhcnLang;

  langStore.subscribe(value => {
    Lang = getLang(value);
  });

  let menuItems = [
    { url: '/', pageName: 'map', text: Lang.menu.map, imgSrc: './resource/images/map.png' },
    { url: '/apothegm', pageName: 'apothegm', text: Lang.menu.apo, imgSrc: './resource/images/apothegm.png' },
    { url: '/general', pageName: 'general', text: Lang.menu.general, imgSrc: './resource/images/apothegm.png' },
    { url: '/about', pageName: 'about', text: Lang.menu.about, imgSrc: './resource/images/about.png' },
  ];

  afterUpdate(() => {
    menuItems = [
      { url: '/', pageName: 'map', text: Lang.menu.map, imgSrc: './resource/images/map.png' },
      { url: '/apothegm', pageName: 'apothegm', text: Lang.menu.apo, imgSrc: './resource/images/apothegm.png' },
      { url: '/general', pageName: 'general', text: Lang.menu.general, imgSrc: './resource/images/apothegm.png' },
      { url: '/about', pageName: 'about', text: Lang.menu.about, imgSrc: './resource/images/about.png' },
    ];
  });
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
