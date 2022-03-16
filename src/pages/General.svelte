<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageStore, langContentStore, langStore } from '../stores';
  import { setCookie } from '../utils/utils';

  import getLang from '../utils/lang';
  import type zhcnLang from '../locale/zhcn';

  /** 语言 */
  let Lang: typeof zhcnLang;

  let currentLang = '';
  let currentContentLang = '';
  langStore.subscribe(v => {
    currentLang = v;
    Lang = getLang(v);
  });
  langContentStore.subscribe(v => {
    currentContentLang = v;
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

  const switchContentLang = () => {
    if (currentContentLang === 'zhcn') {
      langContentStore.set('zhtw');
    } else {
      langContentStore.set('zhcn');
    }
    setCookie('langContent', currentContentLang);
  };
</script>

<div class="container">
  <div class="btnContainer">
    <p>{Lang.general.menulang}</p>
    <button
      class={currentLang === 'zhcn' && 'active'}
      on:click={() => {
        langStore.set('zhcn');
        setCookie('lang', currentLang);
      }}>简体</button
    >
    <button
      class={currentLang === 'zhtw' && 'active'}
      on:click={() => {
        langStore.set('zhtw');
        setCookie('lang', currentLang);
      }}>正體</button
    >
  </div>

  <br />

  <div class="btnContainer">
    <p>{Lang.general.maplang}</p>
    <button
      class={currentContentLang === 'zhcn' && 'active'}
      on:click={() => {
        langContentStore.set('zhcn');
        setCookie('langContent', currentLang);
      }}>简体</button
    >
    <button
      class={currentContentLang === 'zhtw' && 'active'}
      on:click={() => {
        langContentStore.set('zhtw');
        setCookie('langContent', currentLang);
      }}>正體</button
    >
    <button
      class={currentContentLang === '' && 'active'}
      on:click={() => {
        langContentStore.set('');
        setCookie('langContent', currentLang);
      }}>{Lang.general.dontConvert}</button
    >
  </div>

  <br />
  <p>后续功能开发中</p>
</div>

<style>
  .container {
    height: 100%;
    width: 100%;
    padding: 5px;
  }
  .container p {
    color: rgb(208, 200, 181);
    min-width: fit-content;
    margin-right: 10px;
  }
  .btnContainer {
    display: flex;
    width: 90%;
    padding: 0 10px;
  }
  button {
    width: 100%;
    height: 35px;
    font-size: 1em;
  }
</style>
