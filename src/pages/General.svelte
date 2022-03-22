<script lang="ts">
  import LangButton from '../components/button/LangButton.svelte';
  import { SupportedLang } from '../utils/enum';
  import { t } from 'svelte-i18n';
  import { changeLang, lang } from '../locale';
  import { changeConvertTarget, ConvertType } from '../utils/convertor';
  import { convertTargetStore, isMobile } from '../stores';
</script>

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
      <LangButton buttonLang={ConvertType.s2t} buttonText="简转繁" currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
      <LangButton buttonLang={ConvertType.t2s} buttonText="繁轉簡" currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
      <LangButton buttonLang={ConvertType.dont} buttonText={$t('general.dontConvert')} currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
    </div>
  </div>

  <br />

  <div class="settingItem">
    <button
      class="settingbutton"
      on:click={() => {
        const hiddens = localStorage.getItem('hidden')?.split('|');
        if (!hiddens || hiddens.length - 1 >= 0) {
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
</style>
