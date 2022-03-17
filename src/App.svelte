<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router, { location } from 'svelte-spa-router';
  import { routes } from './router/router';
  import MenuItem from './components/MenuItem.svelte';
  import { t, isLoading } from 'svelte-i18n';

  /** 语言 */
  $: menuItems = [
    { path: '/', text: $t('menu.map'), imgSrc: './resource/images/map.png' },
    { path: '/apothegm', text: $t('menu.apo'), imgSrc: './resource/images/apothegm.png' },
    { path: '/general', text: $t('menu.general'), imgSrc: './resource/images/general.png' },
    { path: '/about', text: $t('menu.about'), imgSrc: './resource/images/about.png' },
  ];
</script>

{#if $isLoading}
  Loading...
{:else}
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
{/if}

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
