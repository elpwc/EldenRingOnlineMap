<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import { currentPageStore, isAdminModeStore } from '../stores';

  onMount(() => {
    currentPageStore.set('about');
    clickTime = 0;
  });

  /** 管理员模式 */
  let isAdminMode = false;

  isAdminModeStore.subscribe(v => {
    isAdminMode = v;
  });

  /** 薪火点了几下 */
  let clickTime = 0;

  /** 管理员模式密码Modal */
  let inputPasswordVisibility = false;
  /** 请一杯奶茶Modal */
  let coffeeVisibility = false;

  /** 输入的密码 */
  let inputPw = '';
</script>

<div class="container">
  <!--薪火-->
  <img
    src="./resource/images/fire.png"
    alt="fire"
    height="50%"
    on:click={() => {
      clickTime++;
      // 点五下出发管理员ModeModal
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
    build by <a href="https://github.com/elpwc" target="_blank"
      >@elpwc<sup>
        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
          />
        </svg>
      </sup>
    </a>
    &copy; 2022 wniko, MIT License<br />

    Map Data (Surface) Source:
    <a href="https://www.ali213.net/zt/eldenring/map/" target="_blank"
      >Youxia
      <sup>
        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
          />
        </svg>
      </sup>
    </a><br />
    最近更新: 2020-3-12 23:11
  </p>

  <!--请杯奶茶呜呜呜呜-->
  <button
    on:click={() => {
      coffeeVisibility = true;
    }}
  >
    请一杯奶茶☕
  </button>

  <!--下面的按钮组-->
  <div id="buttonsDiv">
    <button
      on:click={() => {
        window.open('https://github.com/elpwc/EldenRingOnlineMap/issues', '_blank');
      }}
    >
      漏洞・意见反馈
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
      GitHub页面
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
  <p style="color: rgb(208, 200, 181);">觉得帮到了自己的话，可以请咱喝一杯奶茶当作创作激励(</p>
  <div style="display: flex; justify-content: center; padding-bottom: 20px;">
    <img style="height: 50%; max-width: 50%;" src="./resource/images/qrcode.jpg" alt="AlipayQRCode" />
  </div>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: rgb(21, 22, 17);
    color: rgb(208, 200, 181);
    align-items: center;
    justify-content: space-between;
    user-select: none;
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
    margin-bottom: 50px;
  }
  button {
    font-size: 1em;
    padding: 5px 20px;
  }
</style>
