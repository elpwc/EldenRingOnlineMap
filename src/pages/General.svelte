<script lang="ts">
  import LangButton from '../components/button/LangButton.svelte';
  import { SupportedLang } from '../utils/enum';
  import { t } from 'svelte-i18n';
  import { changeLang, lang } from '../locale';
  import { changeConvertTarget, ConvertType } from '../utils/convertor';
  import { convertTargetStore } from '../stores';
</script>

<div class="container">
  <div class="btnContainer">
    <p>{$t('general.menulang')}</p>
    <LangButton buttonLang={SupportedLang.zhCN} buttonText="简体" currentLang={$lang} on:click={event => changeLang(event.detail.lang)} />
    <LangButton buttonLang={SupportedLang.zhTW} buttonText="正體" currentLang={$lang} on:click={event => changeLang(event.detail.lang)} />
  </div>

  <br />
  <div class="btnContainer">
    <p>{$t('general.maplang')}</p>
    <LangButton buttonLang={ConvertType.s2t} buttonText="简转繁" currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
    <LangButton buttonLang={ConvertType.t2s} buttonText="繁轉簡" currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
    <LangButton buttonLang={ConvertType.dont} buttonText={$t('general.dontConvert')} currentLang={$convertTargetStore} on:click={event => changeConvertTarget(event.detail.lang)} />
  </div>

  <br />

  <button class="settingbutton"
    on:click={() => {
      const hiddens = localStorage.getItem('hidden')?.split('|');
      if (hiddens.length === 0) {
        alert($t('general.theresNoHiddenPointByNow'));
      } else {
        const r = confirm($t('general.therereSomeHiddenPoints').replace('{count}', hiddens.length.toString()));
        if (r === true) {
          localStorage.setItem('hidden', '');
          alert($t('general.hiddenPointYattaze'));
        }
      }
    }}>⚠ {$t('general.clearHiddenPointButton')} ⚠</button
  >

  <p>{$t('general.developping')}</p>
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
  .settingbutton{
    width: 90%;
    padding: 10px;
  }
</style>
