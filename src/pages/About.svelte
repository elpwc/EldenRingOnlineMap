<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import { isAdminModeStore } from '../stores';
  import { t } from 'svelte-i18n';
  import type { Statistics } from '../utils/typings';
  import { getSiteTypeFilters } from '../utils/filters';

  onMount(() => {
    clickTime = 0;
  });

  /** 管理员模式 */
  let isAdminMode: boolean = false;

  isAdminModeStore.subscribe(v => {
    isAdminMode = v;
  });

  /** 薪火点了几下 */
  let clickTime: number = 0;

  /** 管理员模式密码Modal */
  let inputPasswordVisibility: boolean = false;
  /** 请一杯奶茶Modal */
  let coffeeVisibility: boolean = false;

  /** 输入的密码 */
  let inputPw: string = '';

  /** 获取到的统计信息 */
  let statisticsData: Statistics = {
    markerCount: 0,
    markerCountWithoutDeleted: 0,
    mostSearched: [],
    types: [],
  };

  /** 从服务器获取统计信息 */
  const getStatisticsData = () => {
    axios.get('./statistics.php').then(res => {
      statisticsData = res.data as Statistics;
    });
  };

  onMount(() => {
    getStatisticsData();
  });
</script>

<div class="container">
  <div class="demiContainer">
    <!--薪火-->
    <img
      src="./resource/images/fire.png"
      alt="fire"
      height="40%"
      on:click={() => {
        clickTime++;
        // 点五下触发管理员ModeModal
        if (clickTime === 5) {
          inputPasswordVisibility = true;
          clickTime = 0;
        }
      }}
    />

    <!--Elden Ring Online Map-->
    <p id="title" class="svelte-q01t2y">
      <span class="heads">E</span>LDEN RING ONLINE MA<span class="heads">P</span>
      {#if isAdminMode}
        <!--AdminMode显示Admin字样-->
        <span
          on:click={() => {
            // 点一下退出AdminMode
            isAdminModeStore.set(false);
          }}>(Admin)</span
        >
      {/if}
    </p>

    <!--copyright信息和数据来源-->
    <p id="cr">
      build by
      <a href="https://github.com/elpwc" target="_blank">
        @elpwc
        <sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
            />
          </svg>
        </sup>
      </a>
      &copy; 2022 wniko, MIT License<br />

      Map Image Source:
      <a href="https://www.ali213.net/zt/eldenring/map/" target="_blank">
        Youxia
        <sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
            />
          </svg>
        </sup>
      </a>
      <br />

      {$t('about.lastUpdate')}: 2022-3-28 12:56
      <br />

      Contributors:
      <a href="https://github.com/spking11" target="_blank">
        @spking11
        <sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
            />
          </svg>
        </sup>
      </a><br />
      and all Tarnisheds
    </p>

    <!--请杯奶茶呜呜呜呜-->
    <button
      on:click={() => {
        coffeeVisibility = true;
      }}
    >
      {$t('about.coffee')}
    </button>

    <!--下面的按钮组-->
    <div id="buttonsDiv">
      <button
        on:click={() => {
          window.open('https://github.com/elpwc/EldenRingOnlineMap/issues', '_blank');
        }}
      >
        {$t('about.feedback')}
        <sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
            />
          </svg>
        </sup>
      </button>

      <button
        on:click={() => {
          window.open('https://github.com/elpwc/EldenRingOnlineMap', '_blank');
        }}
      >
        {$t('about.github')}
        <sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
            />
          </svg>
        </sup>
      </button>
    </div>
  </div>

  <div class="demiContainer">
    <div id="statisticsInfo">
      <p>{$t('about.statistics.title')}</p>
      <hr />
      <div>
        <span>{$t('about.statistics.days')}</span><span
          >{$t('about.statistics.daysData').replace('{days}', String(Math.ceil((Date.now() - new Date('2022-03-04 11:30:00').getTime()) / 1000 / 86400)))}</span
        >
      </div>
      <div>
        <span>{$t('about.statistics.markers')}</span><span> {$t('about.statistics.markersData').replace('{count}', String(statisticsData.markerCount))}</span>
      </div>
      <div>
        <span>{$t('about.statistics.markersWithoutDeleted')}</span><span> {$t('about.statistics.ipData').replace('{count}', String(statisticsData.markerCountWithoutDeleted))}</span>
      </div>
      <p class="hr">——————{$t('about.statistics.weeklyUpdate')} (2022-3-28 12:53)</p>
      <div>
        <span>{$t('about.statistics.view')}</span><span>{$t('about.statistics.viewData').replace('{count}', '623010')}</span>
      </div>
      <div>
        <span>{$t('about.statistics.ip')}</span><span>{$t('about.statistics.ipData').replace('{count}', '323481')}</span>
      </div>
      <div>
        <span>{$t('about.statistics.dayView')}</span><span>{$t('about.statistics.dayViewData').replace('{count}', '27013')}</span>
      </div>
      <div>
        <span>{$t('about.statistics.dayIp')}</span><span>{$t('about.statistics.dayIpData').replace('{count}', '14189')}</span>
      </div>
      <div>
        <span>{$t('about.statistics.mostOrigin')}</span><span>ref.gamer.com.tw</span>
      </div>
      <div>
        <span>{$t('about.statistics.mostRegion')}</span><span>广东省(12.58%)</span>
      </div>
      <p class="hr">——————{$t('about.statistics.mostSearched')}——————</p>
      {#each statisticsData.mostSearched as search}
        <div>
          <span>{search.word}</span><span>{search.count}</span>
        </div>
      {/each}
      <p class="hr">——————{$t('about.statistics.types')}——————</p>
      {#each statisticsData.types as type}
        <div>
          <span>
            {getSiteTypeFilters($t).filter(f => {
              return String(f.value) === type.word;
            })?.[0]?.name ?? $t('about.statistics.testMarker')}
          </span>
          <span>{type.count}</span>
        </div>
      {/each}
      <div style="padding: 30px 0; text-align: center;">
        <img src="https://www.elpwc.com/imagebank/xdz.gif" width="100px" alt="kwiixdz" />
        <p>{$t('about.statistics.end')}</p>
      </div>
    </div>
  </div>
</div>

<!--输入管理员密码Modal-->
<Modal
  visible={inputPasswordVisibility}
  showOkButton
  showCloseButton
  onOKButtonClick={() => {
    // 前往后端验证密码
    axios.post('./checkAdmin.php', { p: inputPw }).then(res => {
      if (res.data?.validate) {
        isAdminModeStore.set(res?.data?.validate);
        inputPasswordVisibility = false;
        inputPw = '';
      }
    });
  }}
  onCloseButtonClick={() => {
    inputPasswordVisibility = false;
    inputPw = '';
  }}
>
  <input style="margin: 20px 0; font-size: 1em;" type="password" bind:value={inputPw} />
</Modal>

<!--请一杯奶茶Modal-->
<Modal
  visible={coffeeVisibility}
  showOkButton
  onOKButtonClick={() => {
    coffeeVisibility = false;
  }}
>
  <div id="modalContainer">
    <p style="color: rgb(208, 200, 181);">{$t('about.modals.coffee.text')}</p>
    <div style="display: flex; flex-direction:column; align-items:center; justify-content: center; padding-bottom: 20px;">
      <img style="height: 80%; max-width: 80%;" src="./resource/images/qrcode.jpg" alt="QRCode" />
      <p>{$t('about.modals.coffee.or')}</p>
      <a href="https://www.buymeacoffee.com/elpwc" target="_blank">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 130px !important;" />
      </a>
    </div>
  </div>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    background-color: rgb(21, 22, 17);
    color: rgb(208, 200, 181);
    align-items: center;
    justify-content: space-around;
    user-select: none;
    flex-wrap: wrap;
    overflow-y: scroll;
  }
  .demiContainer {
    display: flex;
    flex-direction: column;
    height: calc(100% - 50px);
    width: 50%;
    min-width: fit-content;
    color: rgb(208, 200, 181);
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
  #statisticsInfo {
    margin: 3% 20px;
    border: solid 2px rgb(243, 200, 99);
    border-radius: 10px;
    padding: 20px;
    padding-top: 5px !important;
    width: 80%;
    height: 100%;
    overflow-y: scroll;
  }
  #statisticsInfo p {
    margin: 5px 0;
    text-align: center;
    font-size: 1.5em;
  }
  #statisticsInfo div {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .hr {
    width: 100%;
    font-size: 0.9em !important;
  }
  a {
    color: rgb(208, 200, 181);
  }
  .heads {
    font-size: 1.4em;
  }
  #title {
    font-size: 1.5em;
  }
  #cr {
    font-size: 0.9em;
    text-align: center;
  }
  #buttonsDiv {
    display: flex;
    gap: 20px;
    margin: 10px 0;
  }
  button {
    font-size: 1em;
    padding: 5px 20px;
  }
  #modalContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #modalContainer p {
    color: rgb(208, 200, 181);
    margin: 10px 0;
  }
</style>
