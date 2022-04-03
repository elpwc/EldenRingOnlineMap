<script lang="ts">
  import LangButton from '../components/button/LangButton.svelte';
  import ImportButton from '../components/button/ImportButton.svelte';
  import ExportButton from '../components/button/ExportButton.svelte';

  import { SupportedLang } from '../utils/enum';
  import { t } from 'svelte-i18n';
  import { lang } from '../stores';
  import { ConvertType } from '../utils/convertor';
  import { convertTargetStore, isMobile } from '../stores';
</script>

<header>
  {$t('general.title')}
</header>
<div class="container" style="width: {isMobile ? '100%' : '50%'};">
  <div class="settingItem">
    <p>{$t('general.menulang')}</p>
    <div class="btnContainer">
      <LangButton buttonLang={SupportedLang.zhCN} buttonText="简体" currentLang={$lang} on:click={event => lang.set(event.detail.lang)} />
      <LangButton buttonLang={SupportedLang.zhTW} buttonText="正體" currentLang={$lang} on:click={event => lang.set(event.detail.lang)} />
    </div>
  </div>

  <br />

  <div class="settingItem">
    <p>{$t('general.maplang')}</p>
    <div class="btnContainer">
      <LangButton buttonLang={ConvertType.s2t} buttonText="轉為正體" currentLang={$convertTargetStore} on:click={event => convertTargetStore.set(event.detail.lang)} />
      <LangButton buttonLang={ConvertType.t2s} buttonText="转为简体" currentLang={$convertTargetStore} on:click={event => convertTargetStore.set(event.detail.lang)} />
      <LangButton buttonLang={ConvertType.dont} buttonText={$t('general.dontConvert')} currentLang={$convertTargetStore} on:click={event => convertTargetStore.set(event.detail.lang)} />
    </div>
  </div>

  <br />

  <div class="settingItem">
    <p style="margin-right: 0px;">本地数据管理</p>
    <div class="tooltip">
      <span class="tooltiptext">当前导入/导出功能只读取/保存收藏点与隐藏点的id</span>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="35" height="35" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"
        ><circle cx="12" cy="19" r="2" fill="#d0c8b5" /><path fill="#d0c8b5" d="M10 3h4v12h-4z" /></svg
      >
    </div>
  
    <div class="btnContainer">
      <ExportButton buttonText="导出" />
      <ImportButton buttonText="导入" />
    </div>
  </div>

  <br />

  <div class="settingItem">
    <button
      class="settingbutton"
      on:click={() => {
        const hiddens = localStorage.getItem('hidden')?.split('|');
        if (!hiddens || hiddens.length - 1 <= 0) {
          alert($t('general.theresNoHiddenPointByNow'));
        } else {
          const r = confirm($t('general.therereSomeHiddenPoints').replace('{count}', (hiddens.length - 1).toString()));
          if (r === true) {
            localStorage.setItem('hidden', '');
            alert($t('general.hiddenPointYattaze'));
          }
        }
      }}>⚠ {$t('general.clearHiddenPointButton')} ⚠</button
    >
  </div>

  <p>{$t('general.developing')}</p>
</div>

<style>
  header {
    width: 100%;
    height: 20px;
    background-color: rgb(50, 51, 45);
    color: rgb(208, 200, 181);
    font-size: large;
    text-align: center;
    padding: 10px 0;
    box-shadow: 0 0 10px 0 black;
  }
  .container {
    height: 100%;
    padding: 5px;
    margin: auto;
  }
  .container p {
    color: rgb(208, 200, 181);
    min-width: fit-content;
    margin-right: 10px;
  }
  .settingItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    padding: 0 10px;
  }
  .btnContainer {
    display: flex;
    width: 70%;
  }
  .settingbutton {
    width: 100%;
    padding: 10px;
    font-size: 1em;
  }

  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    width: 120px;
    bottom: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
    visibility: hidden;
    background-color: #d0c8b5;
    color: black;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
  }

  .tooltip .tooltiptext::after {
    content: ' ';
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #d0c8b5 transparent transparent transparent;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>
