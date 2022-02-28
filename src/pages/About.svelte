<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageStore } from '../stores';

  onMount(() => {
    currentPageStore.set('about');
  });
</script>

<div class="container">
  <img src="./resource/images/fire.png" alt="fire" height="50%"/>
  <p id="title">Elden Ring Online Map</p>
  <p id="cr">
    build by <a href="https://github.com/elpwc" target="_blank"
      >@elpwc<sup>
        <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
          />
        </svg>
      </sup>
    </a> &copy; 2022, MIT License
  </p>
  <div id="buttonsDiv">
    <button
      on:click={() => {
        window.open('https://github.com/elpwc/EldenRingOnlineMap/issues', '_blank');
      }}
      >漏洞、建议反馈
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
  }
  a {
    color: rgb(208, 200, 181);
  }
  #title {
    font-size: 1.5em;
  }
  #cr {
    font-size: 0.5em;
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
