<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router, { location } from 'svelte-spa-router';
  import { routes } from './router/router';
  import MenuItem from './components/MenuItem.svelte';
  import { t, isLoading } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { getCookie, setCookie } from './utils/utils';
  import * as config from './config';
  import UpdateContentModal from './components/UpdateContentModal.svelte';
  import CooperationModal from './components/CooperationModal.svelte';
  import { lang } from './stores';
  import { SupportedLang } from './utils/enum';
  import { layeringCoffmanGraham } from 'd3-dag';

  let updateVisibility = false;
  let cooperationModalVisibility = false;

  /** 语言 */
  $: menuItems = [
    { path: '/', text: $t('menu.map'), imgSrc: './resource/images/map.png' },
    { path: '/apothegm', text: $t('menu.apo'), imgSrc: './resource/images/apothegm.png' },
    { path: '/routes', text: $t('menu.routes'), imgSrc: './resource/images/bag.png' },
    { path: '/collect', text: $t('menu.collect'), imgSrc: './resource/images/collection.png' },
    //{ path: '/3dmap', text: $t('menu.tdmap'), imgSrc: './resource/images/apothegm.png' },
    { path: 'https://www.wanjiadongli.com/games/2815?tab=2&inviteCode=eldenringmap114514', text: $t('menu.mods'), imgSrc: './resource/images/shield.png', useOuterUrl: true, target: '_blank' },
    { path: '/general', text: $t('menu.general'), imgSrc: './resource/images/general.png' },
    { path: '/about', text: $t('menu.about'), imgSrc: './resource/images/about.png' },
  ];

  // 根据语言初始化网页标题
  document.title = $t('title');

  onMount(() => {
    const lastVersion = getCookie('version');
    if (lastVersion !== config.default.currentVer) {
      if (config.default.showUpdateModal) {
        updateVisibility = true;
      }
    }

    // for defaultly ja
    // setTimeout(() => {
    //   lang.set(SupportedLang.ja);
    // }, 1000);
    // setTimeout(() => {
    //   lang.set(SupportedLang.ja);
    // }, 5000);
  });
</script>

{#if $isLoading}
  Loading...
{:else}
  <div style="height: 100%;{$location == '/' && '-webkit-user-select: none;user-select: auto;'}">
    <!--菜单栏-->
    <nav class="menu">
      {#each menuItems as item}
        <MenuItem currentPath={$location} {...item} />
      {/each}
    </nav>

    <!--所有页面-->
    <main style="height: calc( 100% - 60px );">
      <Router {routes} />
    </main>
  </div>

  <!--更新Modal-->
  <UpdateContentModal
    {updateVisibility}
    onOKButtonClick={() => {
      setCookie('version', config.default.currentVer);
      updateVisibility = false;
      cooperationModalVisibility = true;
    }}
  />

  <CooperationModal {cooperationModalVisibility} />
{/if}

<style>
  .menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #171715;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    z-index: 600;
    box-shadow: 0 0 30px 0 #54524a;
  }
</style>
