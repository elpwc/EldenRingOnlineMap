<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router/router';
  import { langStore } from './stores';
  import { location } from 'svelte-spa-router';
  import MenuItem from './components/MenuItem.svelte';
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import { getCookie } from './utils/utils';
  import getLang from './utils/lang';
  import type zhcnLang from './locale/zhcn';

  /** 语言 */
  let Lang: typeof zhcnLang;

  langStore.subscribe(value => {
    Lang = getLang(value);
  });

  let menuItems = [
    { path: '/', text: Lang.menu.map, imgSrc: './resource/images/map.png' },
    { path: '/apothegm', text: Lang.menu.apo, imgSrc: './resource/images/apothegm.png' },
    { path: '/general', text: Lang.menu.general, imgSrc: './resource/images/general.png' },
    { path: '/about', text: Lang.menu.about, imgSrc: './resource/images/about.png' },
  ];

  afterUpdate(() => {
    menuItems = [
      { path: '/', text: Lang.menu.map, imgSrc: './resource/images/map.png' },
      { path: '/apothegm', text: Lang.menu.apo, imgSrc: './resource/images/apothegm.png' },
      { path: '/general', text: Lang.menu.general, imgSrc: './resource/images/general.png' },
      { path: '/about', text: Lang.menu.about, imgSrc: './resource/images/about.png' },
    ];
  });
</script>

<div style="height: 100%; ">
  <!--菜单栏-->
  <nav class="menu">
    {#each menuItems as item}
      <MenuItem currentPath={$location} {...item} />
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
