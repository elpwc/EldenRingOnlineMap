<script lang="ts">
  let fileinput;
  export let buttonText: string;
  export let fileType: string = '.json';

  const dealImportJson = (str: string) => {
    try {
      let json = JSON.parse(str);
      localStorage.setItem('hidden', localStorage.getItem('hidden') + '|' + (json['hiddens'] as string[])?.join('|'));
      localStorage.setItem('collect', localStorage.getItem('collect') + '|' + (json['collects'] as string[])?.join('|'));
    } catch (e) {
      alert(e);
    }
  };

  const onFileSelected = e => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(image);
    reader.onload = e => {
      dealImportJson(e.target.result as string);
    };
  };
</script>

<input style="display:none" type="file" accept={fileType} on:change={e => onFileSelected(e)} bind:this={fileinput} />
<button
  on:click={() => {
    fileinput.click();
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
