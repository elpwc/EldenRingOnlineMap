<!--
  菜单栏在这喵
-->
<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router/router';
  import MenuItem from './components/MenuItem.svelte';
</script>

<div style="height: 100%; ">
  <!--菜单栏-->
  <nav class="menu">
    <MenuItem url="/" pagename="map" icon="./resource/images/map.png">地图</MenuItem>
    <MenuItem url="/apothegm" pagename="apothegm" icon="./resource/images/apothegm.png">讯息</MenuItem>
    <MenuItem url="/general" pagename="general" icon="./resource/images/apothegm.png">我的(开发中)</MenuItem>
    <MenuItem url="/about" pagename="about" icon="./resource/images/about.png">说明</MenuItem>
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
