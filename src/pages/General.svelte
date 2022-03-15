<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageStore, langStore } from '../stores';
  import { setCookie } from '../utils/utils';

  let currentLang = '';
  langStore.subscribe(v => {
    currentLang = v;
  });

  onMount(() => {
    currentPageStore.set('general');
  });

  const switchLang = () => {
    if (currentLang === 'zhcn') {
      langStore.set('zhtw');
    } else {
      langStore.set('zhcn');
    }
    setCookie('lang', currentLang);
  };
</script>

<div class="container">
  <p>《个人页》</p>
  <p>大概下周开发</p>
  <p>先放个空白页在这免得下周又懒得做了()</p>
  <p>预计功能：</p>
  <p>1. 收藏/隐藏点一览 导出备份为文件 导入</p>
  <p>2. 个人设置（简繁切换 / 等等）</p>
  <p>更好的建议请写到讯息里</p>
  <button on:click={switchLang}>切换语言{currentLang}</button>
</div>

<style>
  .container {
    height: 100%;
    width: 100%;
  }
  .container p {
    color: rgb(208, 200, 181);
  }
</style>
