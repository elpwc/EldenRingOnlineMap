<script lang="typescript">
  import { link } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';
  import { currentPageStore } from '../stores';

  let currentPage: string = 'map';
  currentPageStore.subscribe(v => {
    currentPage = v;
  });

  export let url: string = '';
  export let pagename: string = '';
  export let icon: string = '';
</script>

<a href={url} use:link>
  {#if currentPage === pagename}
    <div class="backgroundLight" transition:fade />
  {/if}<img src={icon} alt="mapicon" width="40px" />
  <span><slot /></span>
</a>

<style>
  a {
    width: -webkit-fill-available;
    text-align: center;
    color: rgb(208, 200, 181);
    text-decoration-line: none;
    font-family: 'Times New Roman', Times, serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-shadow: 0 0 5px black;
    user-select: none;
    transition: all 0.3s;
  }
  a img {
    padding: 0px;
    user-select: none;
  }
  a span {
    padding: 4px 0;
  }
  @media (any-hover: hover) {
    a:hover {
      background-color: #1e1e1c;
    }
  }
  .backgroundLight {
    box-shadow: 0px 80px 30px 30px rgb(144 139 123);
  }
</style>
