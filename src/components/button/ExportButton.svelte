<script lang="ts">
  import { saveAs } from 'file-saver';
  import { hiddenSet, collectionSet } from '../../stores';
  import { StorageSerializers, Serializer } from '../../utils/persist';
  import dayjs from 'dayjs';
  import { t } from 'svelte-i18n';

  export let buttonText: string;

  const serializer: Serializer<Set<number>> = StorageSerializers['set'];
  // export let fileType: string = '.json';
</script>

<button
  on:click={() => {
    try {
      var blob = new Blob(
        [
          JSON.stringify({
            hiddens: serializer.write(hiddenSet.getStore().getPoints()),
            collections: serializer.write(collectionSet.getStore().getPoints()),
          }),
        ],
        { type: 'application/json;charset=utf-8' }
      );
      saveAs(blob, 'eldenringmap_' + dayjs().format('YYYY_MM_DD_HH_mm_ss') + '.json');
    } catch (e) {
      console.log($t('general.localData.exportError') + `(${e})`);
    }
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
