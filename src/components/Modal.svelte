<!--
  自定义Modal组件
  Author: wniko
-->
<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  export let title: string = '';
  export let width: string = '60%';
  export let top: string = '20%';
  export let showOkButton: boolean = false;
  export let showCloseButton: boolean = false;
  export let okButtonText: string = 'OK';
  export let closeButtonText: string = 'Close';
  export let onOKButtonClick: (value?: any) => void = () => {};
  export let onCloseButtonClick: (value?: any) => void = () => {};
  /** 完全消失后的回调喵 */
  export let onFlyOutEnd: (value?: any) => void = () => {};
  //export let onLoad: (value?: any) => void = () => {};
  export let visible: boolean = false;
  /** 关闭时强制刷新 */
  //export let refreshOnClose: boolean = false;
  export let zindex: number = 0;
  export let backgroundColor: string = 'black';
  export let backgroundOpacity: number = 0.7;
</script>

{#if visible}
  <div id="container" style="z-index: {zindex};{ visible && '-webkit-user-select: auto;'}">
    <div id="bg" style="background-color: {backgroundColor}; opacity: {backgroundOpacity}" transition:fade={{ duration: 300 }} on:outroend={onFlyOutEnd} />

    <div class="modal" style="width: {width}; top: {top};" transition:fly={{ y: 200, duration: 300 }}>
      <!--标题-->
      {#if title}
        <p class="title">{title}</p>
        <hr />
      {/if}
      <div class="content" style="padding: 5px; max-height: {window.innerHeight * 0.75}px">
        <slot />
        <div style="display:flex; justify-content:space-around;">
          {#if showOkButton}
            <button class="active" on:click={onOKButtonClick} style="margin-right: 5px;">{okButtonText}</button>
          {/if}
          {#if showCloseButton}
            <button on:click={onCloseButtonClick}>{closeButtonText}</button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  #bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
  .modal {
    position: absolute;
    height: fit-content;
    background-attachment: fixed;
    z-index: 1;
    border-radius: 10px;
  }
  #container {
    position: absolute;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .title {
    width: 100%;
    text-align: center;
    color: rgb(239 234 222);
    text-shadow: 0 0 7px rgb(208 200 181);
    font-size: 1.5em;
  }
  button {
    font-size: 1em;
    padding: 5px 20px;
  }
  .content {
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
