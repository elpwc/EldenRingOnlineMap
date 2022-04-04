<script lang="ts">
  import { hiddenSet, collectionSet } from '../../stores';
  import { StorageSerializers, Serializer } from '../../utils/persist';
  import { t } from 'svelte-i18n';
  import { get } from 'svelte/store';

  export let buttonText: string;
  export let fileType: string = '.json';

  let fileinput: HTMLInputElement;
  let files: FileList | undefined;
  let isImporting = false;

  const serializer: Serializer<Set<number>> = StorageSerializers['set'];
  const importJson = (str: string) => {
    try {
      const data = JSON.parse(str);
      hiddenSet.getStore().addPoints(serializer.read(data.hiddens));
      collectionSet.getStore().addPoints(serializer.read(data.collections));
    } catch (e) {
      console.log($t('general.localData.importError') + `(${e})`);
    }
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
          isImporting = false;
          let $t = (str: string) => {
            return get(t)(str);
          };
          alert(
            $t('general.localData.importInfo')
              .replace('{files}', String(files.length))
              .replace('{collections}', String(getCollectionsCount() - prevCollectionsCount))
              .replace('{hiddens}', String(getHiddensCount() - prevHiddensCount))
          );
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
  {isImporting ? $t('general.localData.importing') : buttonText}
</button>

<style>
  button {
    width: 100%;
    height: 35px;
    font-size: 1em;
  }
</style>
