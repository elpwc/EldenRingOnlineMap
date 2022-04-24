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
  backgroundOpacity={0.85}
  title="更新内容"
  zindex={1919811}
  onOKButtonClick={() => {
    updateVisibility = false;
    onOKButtonClick();
  }}
>
  <div id="modalContainer">
    <!--实在没空去搭后端了，就硬编码写在前端了orz-->
    <div class="update">
      <p class="updateTitle"><date>{config.default.lastUpdated}</date> 的更新<br />(ver {config.default.currentVer})</p>

      <div class="updateSection">
        <p>
          大家好~ 我是开发者uni<br />
          两个月来感谢大家的使用和支持！<br />
          最近几周因为开始全力准备升学，几乎没怎么更新了，真的非常抱歉<br />
          接下来的一年时间也只会是断断续续更新的状态<br />
          希望大家能理解!!<br />
          不过只要FS社还在，我就会一直努力让网站运营下去的<br />
          希望若干年后DLC发售的时候，大家还能记着这个小站w<br /><br />

          遇到问题的话记得来反馈群: 161952806<br />

          若有意向参与开发，请通过
          <a href="https://github.com/elpwc/EldenRingOnlineMap/issues" target="_blank">github</a> /
          <a href="mailto:elpwc@hotmail.com" target="_blank">email</a> /
          <a href="https://user.qzone.qq.com/2575784532/main" target="_blank">qq</a> /
          <a href="https://twitter.com/elpwc" target="_blank">twitter</a>
          与我取得联系，随时都大欢迎~<br />
        </p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">💡 新的<ruby>特性</ruby>:</p>
        <p>- 添加了支线页的功能预览，在缓慢开发中</p>
        <p>- 这个窗口显示的更新内容也可以在"说明"里查看了</p>
        <p>- 仔细衡量後，考虑到现有的状态下难以投入较大精力开发多个新功能，姑且取消了3D地图的开发计划，备考完再准备吧~</p>
        <p>- 添加了宣传合作项目的页面</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">🐞 修复了bug:</p>
        <p>- 讯息点开後缺少背景，回复列表与讯息列表混在一起不易分辨</p>
      </div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2022-4-6 11:37</date> 的更新<br />(ver 3.1.5.1)</p>
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
  a {
    color: rgb(228, 223, 210);
  }
</style>
