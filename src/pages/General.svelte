<script lang="ts">
  import LangButton from '../components/button/LangButton.svelte';
  import { SupportedLang } from '../utils/enum';
  import { t } from 'svelte-i18n';
  import { changeLang, lang } from '../locale';
  import { changeConvertTarget, ConvertType } from '../utils/convertor';
  import { convertTargetStore, isMobile } from '../stores';
</script>

<header>
  {$t('general.title')}
</header>
<div class="container" style="width: {isMobile ? '100%' : '50%'};">
  <div class="settingItem">
    <p>{$t('general.menulang')}</p>
    <div class="btnContainer">
      <LangButton buttonLang={SupportedLang.zhCN} buttonText="简体" currentLang={$lang} on:click={event => changeLang(event.detail.lang)} />
      <LangButton buttonLang={SupportedLang.zhTW} buttonText="正體" currentLang={$lang} on:click={event => changeLang(event.detail.lang)} />
    </div>
  </div>

  <br />

  <div class="settingItem">
    <p>{$t('general.maplang')}</p>
    <div class="btnContainer">
      <LangButton buttonLang={ConvertType.s2t} buttonText="轉為正體" currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
      <LangButton buttonLang={ConvertType.t2s} buttonText="转为简体" currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
      <LangButton buttonLang={ConvertType.dont} buttonText={$t('general.dontConvert')} currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
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

  <!--april fool!-->
  {#if new Date().getMonth() === 3 && new Date().getDate() === 1}
    <div class="aprilfool">
      <p>{$t('general.april.title')}</p>
      <hr />
      <p>{$t('general.april.content')}</p>
      <button
        on:click={() => {
          window.open('https://pro-video.xiaoheiban.cn/xls/67a483e3-0998-4ff0-b98a-d17159552604.mp4', '_blank');
        }}
        style="font-size: large;">👉{$t('general.april.button')}👈</button
      >
      <date><p>{$t('general.april.footer')}</p></date>
    </div>
  {/if}

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
  .aprilfool {
    margin-top: 10px;
    border: solid 1px white;
    border-radius: 8px;
    padding: 5px;
    color: white;
    text-align: center;
  }
</style>
