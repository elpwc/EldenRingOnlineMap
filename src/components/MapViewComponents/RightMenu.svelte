<script lang="ts">
  import { t } from 'svelte-i18n';
  import { fly } from 'svelte/transition';

  export let x: number = 0;
  export let y: number = 0;
  export let title: string = '';
  export let onHide: () => void = () => {};
  export let onCollect: () => void = () => {};
  export let onEdit: () => void = () => {};
  export let isHidden: boolean = false;
  export let isCollected: boolean = false;
</script>

<div id="rightMenuContainer" style="left: {x}px; top: {y}px;" transition:fly={{ y: 10, duration: 100 }}>
  <p>{title}</p>

  <button
    on:click={() => {
      onHide();
    }}
  >
    {isHidden ? $t('map.modals.info.unhide') : $t('map.modals.info.hide')}
  </button>

  <button
    on:click={() => {
      onCollect();
    }}
  >
    {isCollected ? $t('map.modals.info.uncollect') : $t('map.modals.info.collect')}
  </button>

  <button
    on:click={() => {
      onEdit();
    }}
  >
    编辑
  </button>
</div>

<style>
  #rightMenuContainer {
    position: fixed;
    z-index: 114513;
    border-radius: 0 5px 5px 5px;
    height: fit-content;
    min-width: 80px;
    width: fit-content;
    background-color: rgba(0, 0, 0, 0.8);
    color: rgb(208, 200, 181);
    box-shadow: 0 0 5px 0 black;
  }

  #rightMenuContainer p {
    width: fit-content;
    margin: 3px 0;
    padding: 5px 10px;
    font-size: 0.8em;
  }
  #rightMenuContainer button {
    width: 100%;
    padding: 10px 0;
    font-size: 0.9em;
    background-color: rgba(0, 0, 0, 0.5) !important;
    border: none !important;
    box-shadow: none !important;
  }
  #rightMenuContainer button:hover {
    background-color: rgba(50, 50, 50, 0.8) !important;
  }
</style>
