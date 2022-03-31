<script lang="ts">
  import { saveAs } from 'file-saver';

  export let buttonText: string;
  // export let fileType: string = '.json';
</script>

<button
  on:click={() => {
    var blob = new Blob(
      [
        JSON.stringify({
          hiddens: localStorage.getItem('hidden')?.split('|'),
          collects: localStorage.getItem('collect')?.split('|'),
        }),
      ],
      { type: 'application/json;charset=utf-8' }
    );
    saveAs(blob, 'EROM-Data.json');
  }}
>
  {buttonText}
</button>

<style>
  button {
    width: 100%;
    height: 35px;
    font-size: 1em;
  }
</style>
