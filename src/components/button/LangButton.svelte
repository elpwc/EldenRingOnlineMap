<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let currentLang;
  export let buttonLang;
  export let buttonText: string;

  const dispatch = createEventDispatcher();
  const cilck = () =>
    dispatch('click', {
      lang: buttonLang,
    });
</script>

<button class={currentLang === buttonLang && 'active'} on:click={cilck}>
  {buttonText}
</button>

<style>
  button {
    width: 100%;
    height: 35px;
    font-size: 1em;
  }
</style>
