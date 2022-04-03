<script lang="ts">
  import { hiddenSet, collectionSet } from '../../stores';
  import { StorageSerializers, Serializer } from '../../utils/persist';

  let fileinput: HTMLInputElement;
  let files: FileList | undefined;
  let isImporting = false;

  export let buttonText: string;
  export let fileType: string = '.json';

  const serializer: Serializer<Set<number>> = StorageSerializers['set'];

  const importJson = (str: string) => {
    const data = JSON.parse(str);
    hiddenSet.getStore().addPoints(serializer.read(data.hiddens));
    collectionSet.getStore().addPoints(serializer.read(data.collections));
  };

  const getCollectionsCount = () => {
    return collectionSet.getStore().getPoints().size;
  };
  const getHiddensCount = () => {
    return hiddenSet.getStore().getPoints().size;
  };

  $: if (files) {
    isImporting = true;
    let importingCount = files.length;
    let prevCollectionsCount = getCollectionsCount();
    let prevHiddensCount = getHiddensCount();

    for (const file of files) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        importJson(e.target.result as string);
        if (--importingCount == 0) {
          console.log('finish');
          isImporting = false;
          alert(`Import ${getCollectionsCount() - prevCollectionsCount} collections and ${getHiddensCount() - prevHiddensCount} hiddens from ${files.length} files`);
          fileinput.value = '';
        }
      };
    }
  }
</script>

<input style="display:none" type="file" multiple accept={fileType} bind:files bind:this={fileinput} />
<button
  disabled={isImporting}
  on:click={() => {
    fileinput.click();
  }}
>
  {isImporting ? 'importing' : buttonText}
</button>

<style>
  button {
    width: 100%;
    height: 35px;
    font-size: 1em;
  }
</style>
