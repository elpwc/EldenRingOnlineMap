<script lang="ts">
  import axios from 'axios';

  import { onMount } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import { currentPageStore, isAdminModeStore } from '../stores';

  onMount(() => {
    currentPageStore.set('about');
    clickTime = 0;
  });

  let isAdminMode = false;

  isAdminModeStore.subscribe(v => {
    isAdminMode = v;
  });

  let clickTime = 0;
  let inputPasswordVisibility = false;
  let coffeeVisibility = false;
  let inputPw = '';
</script>

<div class="container">
  <img
    src="./resource/images/fire.png"
    alt="fire"
    height="50%"
    on:click={() => {
      clickTime++;
      if (clickTime === 5) {
        inputPasswordVisibility = true;
        clickTime = 0;
      }
    }}
  />
  <Modal
    visible={inputPasswordVisibility}
    showOkButton
    showCloseButton
    onOKButtonClick={() => {
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
  <Modal
    visible={coffeeVisibility}
    showOkButton
    onOKButtonClick={() => {
      coffeeVisibility = false;
    }}
  >
    <p>工作日连肝了3天开发网站</p>
    <p>觉得帮到了自己的话，可以请咱喝一杯奶茶嘛..?</p>
    <div style="display: flex; justify-content: center; padding-bottom: 20px;">
      <img style="width: 50%;" src="./resource/images/qrcode.jpg" alt="AlipayQRCode" />
    </div>
  </Modal>
  <p id="title" class="svelte-q01t2y">
    <span class="heads">E</span>lden <span class="heads">R</span>ing <span class="heads">O</span>nline <span class="heads">M</span>ap
    {#if isAdminMode}
      <span
        on:click={() => {
          isAdminModeStore.set(false);
        }}>(Admin)</span
      >
    {/if}
  </p>
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

    Map Data Source:
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
    </a>
  </p>
  <button
    on:click={() => {
      coffeeVisibility = true;
    }}>请一杯奶茶☕</button
  >
  <div id="buttonsDiv">
    <button
      on:click={() => {
        window.open('https://github.com/elpwc/EldenRingOnlineMap/issues', '_blank');
      }}
      >漏洞・意见反馈
      <sup>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
          />
        </svg>
      </sup>
    </button><button
      on:click={() => {
        window.open('https://github.com/elpwc/EldenRingOnlineMap', '_blank');
      }}
      >GitHub页面<sup>
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
