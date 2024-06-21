<script lang="ts">
  import Modal from './Modal.svelte';
  import * as config from '../config';
  import { isMobile } from '../stores';

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
    // updateVisibility = false;
    onOKButtonClick();
  }}
>
  <div id="modalContainer">
    <!--实在没空去搭后端了，就硬编码写在前端了orz-->

    <div class="update">
      <p class="updateTitle"><date>{config.default.lastUpdated}</date> 的更新<br />(ver {config.default.currentVer})</p>
      <div class="updateSection">
        <p>加入了幽影树碎片和灵灰这两个DLC道具</p>
      </div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2024-6-21 5:57 UT+8</date> 的更新<br />(ver 3.3.1.0)</p>
      <div class="updateSection" style={isMobile ? '' : 'display: flex; gap: 10px; '}>
        {#if isMobile}
          <img style="max-width: 100%;height: fit-content; " src="./resource/images/dlc1.png" alt="dlc1 Shadow of the Erdtree" />
        {:else}
          <img style="max-width: 50%;height: fit-content; " src="./resource/images/dlc1_narrow.png" alt="dlc1 Shadow of the Erdtree _ header for PC" />
        {/if}
        <div>
          <p>时隔一年向大家问声好——！</p>
          <p>盼星星盼月亮终于盼来了万众瞩目的老头环第一份DLC!</p>
          <img style="max-width: 150px;" src="./resource/images/kotone1.gif" alt="kotone" />
          <p>因为现在还没有解包出的DLC地图，所以姑且使用了之前泄露的地图截图作为<b>临时用的DLC地图</b></p>
          <p>用起来会很模糊，给大家带来不便深表歉意... 不过等近几天内有清晰地图後，我会立即进行一个更换的</p>
          <p>嘛总之感谢所有人以往的支持！有大家的支持这个开放式地图才能一直延续运转到现在。祝大家在接下来的DLC内容中玩得愉快~</p>
          <p>有疑问/建议/漏洞反馈的话请进QQ群或者邮箱联系→ 161952806 / elpwc@hotmail.com</p>
          <p>（群里大概也可以拉好哥哥跑图）</p>
          <p class="sectionTitle">✨ 提示:</p>
          <p>- 地标可以通过长按/右键单击快速隐藏和收藏</p>
          <p>- 可以在 设置 里导出/导入隐藏/收藏点</p>
        </div>
      </div>
      <div class="updateSection"></div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2023-3-1 1:39 UT+8</date> 的更新<br />(ver 3.3.0.5)</p>
      <div class="updateSection">
        <p>因为下午收到了严重bug的报告，所以在考试复习中抽空进行了更新喵，这次沒有功能上的新内容</p>
        <p>说起来刚刚FS社公开了DLC的开发，真是令人兴奋的消息阿... 如果DLC有新地图、而且届时咱不忙的话，这里也会第一时间更新的!</p>
        <p>然後就是... 今年(23)年来咱的生活费有些吃紧，方便的话 可以进入"说明"页支持一下服务器续命（小声）</p>
        <p>有疑问进群或者邮箱联系→ 161952806 / elpwc@hotmail.com</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">✨ 提示:</p>
        <p>
          - <b>桌面APP模式</b><br />现在可以作为应用添加到手机或电脑的桌面，和普通的APP使用起来一模一样捏。<br />
          设置方法↓ <br />
        </p>
        <ul>
          <li>手机上，如果浏览器支持的话（一般会是Chrome或者Edge），进入网页就会提示要不要添加在主页/桌面之类的，点确定就行，不行的话，大概是手机没给浏览器权限）</li>
          <li>电脑上的话，在Edge上是地址栏内部右侧有个三个方块组成的图标，点一下就可以了，其他浏览器支持的话应该也大同小异</li>
        </ul>
        <p>- 地标可以通过长按/右键点击快速隐藏/收藏捏</p>
        <p>- 可以在 设置 里导出/导入隐藏/收藏点</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">🐞 修复了bug:</p>
        <p>
          -
          修复了一个很严重很严重的bug，大概是在进入一个点（姑且称为A点）的编辑模式後，点击重新选择位置进入选点模式，但是在这时候又打开了另一个点（姑且叫点B），在关闭点B页面後再重新打开点A，然後提交，就会导致点B的数据被点A覆盖
        </p>
      </div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2022-12-18 8:44</date> 的更新<br />(ver 3.3.0.4)</p>
      <div class="updateSection">
        <p>时隔半年的更新喵，这次带来了<b>桌面应用模式</b>和“竞技场”分类</p>
        <p>有疑问进反馈群或者邮箱联系捏：161952806 / elpwc@hotmail.com</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">✨ 提示:</p>
        <p>
          - <b>桌面应用模式</b><br />现在可以作为应用添加到手机或电脑的桌面，和普通的应用使用起来一模一样捏。<br />
          设置方法↓ <br />
        </p>
        <ul>
          <li>手机上，如果浏览器支持的话，进入网页就会提示要不要添加在主页/桌面之类的，点确定就行，不行的话，大概是手机没给浏览器权限）</li>
          <li>电脑上的话，在Edge上是地址栏内部右侧有个三个方块组成的图标，点一下就可以了，其他浏览器支持的话应该也大同小异(?)</li>
        </ul>
        <p>- 地标可以通过长按/右键点击快速隐藏/收藏捏</p>
        <p>- 可以在 设置 里导出/导入隐藏/收藏点</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">💡 新的<ruby>特性</ruby>:</p>
        <p>- 设置成了PWA应用</p>
        <p>- 添加了新类型“竞技场”</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">🐞 修复了bug:</p>
        <p>- 修复了一个代码中的类型匹配Bug，和功能没有关系捏</p>
      </div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2022-5-2 17:10</date> 的更新<br />(ver 3.3.0.3)</p>
      <div class="updateSection">
        <p>配合 APP 法环地图 - 狭间地冒险指南 的数据格式更新，没有功能上的更新</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">✨ 提示:</p>
        <p>- 地标可以通过长按/右键点击快速隐藏/收藏</p>
        <p>- 可以在 设置 里导出/导入隐藏/收藏点</p>
      </div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2022-4-30 02:07</date> 的更新<br />(ver 3.3.0.2)</p>
      <div class="updateSection">
        <p>很可能是上半年最后一次大(?)更新</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">✨ 提示:</p>
        <p>- 地标是可以通过长按/右键点击快速隐藏/收藏的</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">💡 新的<ruby>特性</ruby>:</p>
        <p><b>- 可以给地标评论了！</b></p>
        <p>- 添加了地标正在载入的提示（现在会有一个转圈圈动画</p>
        <p>- 更新了支线页的数据</p>
        <p>- 支线页的连接线改为曲线</p>
      </div>
      <div class="updateSection">
        <p class="sectionTitle">🐞 修复了bug:</p>
        <p>- 说明页更新窗口只能打开一次</p>
        <p>- 一些碰巧发现随手改了的bug</p>
      </div>
    </div>

    <hr />

    <div class="update">
      <p class="updateTitle"><date>2022-4-24 18:25</date> 的更新<br />(ver 3.2.0.0)</p>

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
  #modalContainer ul {
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
