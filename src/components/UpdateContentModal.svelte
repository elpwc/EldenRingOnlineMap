<script lang="ts">
  import Modal from './Modal.svelte';
  import * as config from '../config';

  export let updateVisibility: boolean = false;
  export let onOKButtonClick: () => void = () => {};
</script>

<Modal
  visible={updateVisibility}
  showOkButton
  top="0%"
  width="85%"
  title="更新内容"
  zindex={1919811}
  onOKButtonClick={() => {
    updateVisibility = false;
    onOKButtonClick();
  }}
>
  <div id="modalContainer">
    <div class="update">
      <p class="updateTitle"><date>{config.default.lastUpdated}</date> 的更新<br />(ver {config.default.currentVer})</p>
      <div class="updateSection">
        <p class="sectionTitle">💡 新的<ruby>特性</ruby>:</p>
        <p>- 添加了3DMap页的基底（开发中）</p>
        <p>- 添加了支线页的预览(?)（即将完成）</p>
        <p>- 优化了对话框的排版, 按钮不会被挤到下面了</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">🐞 修复了bug:</p>
        <p>- 服务器响应失败时说明页会卡住</p>
      </div>
    </div>
    <hr />
    <div class="update">
      <p class="updateTitle"><date>2022-4-5 16:50</date> 的更新<br />(ver 3.1.5.0)</p>
      <div class="updateSection">
        <p class="sectionTitle">💡 新的<ruby>特性<rt>bug</rt></ruby>:</p>
        <p>- 添加了开屏更新提示</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">🐞 修复了bug:</p>
        <p>- 不能清除隐藏点</p>
        <p>- 不能导入隐藏点</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">💻 开发中的功能:</p>
        <p>- 支线页</p>
      </div>
    </div>
  </div>
</Modal>

<style>
  #modalContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #modalContainer p {
    color: rgb(228, 223, 210);
    margin: 10px 0;
  }
  .update {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: -webkit-fill-available;
  }
  .updateSection {
    text-align: left;
  }
  .updateTitle {
    font-size: larger;
    font-weight: bold;
  }
  .sectionTitle {
    text-shadow: 0 0 2px rgb(209, 207, 198);
    font-weight: bold;
  }
  hr {
    width: -webkit-fill-available;
    background-color: navajowhite;
  }
</style>
