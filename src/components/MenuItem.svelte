<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';

  export let currentPath: string;
  export let path: string;
  export let text: string;
  export let width: string = '40px';
  export let imgSrc: string;
  export let imgAlt: string = 'mapicon';
</script>

<a href={path} use:link>
  {#if currentPath === path}
    <div class="backgroundLight" transition:fade />
  {/if}
  <img src={imgSrc} alt={imgAlt} {width} />
  <span>{text}</span>
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
