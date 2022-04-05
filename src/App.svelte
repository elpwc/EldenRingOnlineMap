<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router, { location } from 'svelte-spa-router';
  import { routes } from './router/router';
  import MenuItem from './components/MenuItem.svelte';
  import { t, isLoading } from 'svelte-i18n';
  import Modal from './components/Modal.svelte';
  import { onMount } from 'svelte';
  import { getCookie, setCookie } from './utils/utils';
  import * as config from './config';

  let updateVisibility = false;

  /** 语言 */
  $: menuItems = [
    { path: '/', text: $t('menu.map'), imgSrc: './resource/images/map.png' },
    { path: '/apothegm', text: $t('menu.apo'), imgSrc: './resource/images/apothegm.png' },
    { path: '/routes', text: $t('menu.routes'), imgSrc: './resource/images/apothegm.png' },
    { path: '/general', text: $t('menu.general'), imgSrc: './resource/images/general.png' },
    { path: '/about', text: $t('menu.about'), imgSrc: './resource/images/about.png' },
  ];

  onMount(() => {
    const lastVersion = getCookie('version');
    if (lastVersion !== config.default.currentVer) {
      updateVisibility = true;
    }
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
  <Modal
    visible={updateVisibility}
    showOkButton
    top="10%"
    zindex={1919811}
    onOKButtonClick={() => {
      updateVisibility = false;
      setCookie('version', config.default.currentVer);
    }}
  >
    <div id="modalContainer">
      <div class="update">
        <p class="updateTitle"><date>{config.default.lastUpdated}</date> 的更新<br />(ver {config.default.currentVer})</p>
        <div class="updateSection">
          <p class="sectionTitle">💡 新的<ruby>特性<rt>bug</rt></ruby>:</p>
          <p>- 添加了开屏更新提示</p>
        </div>
        <div class="updateSection">
          <p class="sectionTitle">🐞 修复了bug:</p>
          <p>- 不能清除隐藏点</p>
          <p>- 不能导入隐藏点</p>
        </div>
        <div class="updateSection">
          <p class="sectionTitle">💻 开发中的功能:</p>
          <p>- 支线页</p>
        </div>
      </div>
    </div>
  </Modal>
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
  #modalContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #modalContainer p {
    color: rgb(228, 223, 210);
    margin: 10px 0;
  }
  .update {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .updateSection {
    text-align: left;
  }
  .updateTitle {
    font-size: larger;
    font-weight: bold;
  }
  .sectionTitle {
    text-shadow: 0 0 2px rgb(209, 207, 198);
    font-weight: bold;
  }
</style>
