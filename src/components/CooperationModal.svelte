<script lang="ts">
  import Modal from './Modal.svelte';
  import DownloadOnTheAppStoreIcon from '../assets/icons/icon-download_on_the_App_Store_Badge_CNSC_RGB_wht_092917.svg';
  export let cooperationModalVisibility: boolean = false;
  export let onOKButtonClick: () => void = () => {};
</script>

<Modal
  visible={cooperationModalVisibility}
  showOkButton
  top="0%"
  width="85%"
  backgroundOpacity={0.9}
  title="或许你也可以试试这些合作项目..."
  zindex={1919811}
  onOKButtonClick={() => {
    cooperationModalVisibility = false;
    onOKButtonClick();
  }}
  okButtonText="OK(只会更新後显示一次)"
>
  <div id="modalContainer">
    <div class="item">
      <div class="title">
        <img src="./resource/images/appicon.webp" width="40px" height="40px" alt="icon" style="border-radius: 8px; margin-right: 10px;" />

        <p class="titlep">法环地图 - 狭间地冒险指南</p>
      </div>

      <p>非常出色的iPhone/iPad端法环离线地图，标记、成就查看等..该有的功能应有尽有</p>
      <p>很快会和老头环地图共享数据，使用狭间地冒险指南也可以轻鬆看到这里的个性化标注了~</p>
      <div style="display: flex; gap: 30px; width: 100%; justify-content: center;">
        <img src="./resource/images/app.png" width="100px" alt="qrcode for app" />

        <div style="height: auto; width: 0; border: solid 1px #9f9f9f;" />

        <div>
          <p>点击跳转到App Store页面</p>

          <a href="https://apps.apple.com/cn/app/apple-store/id1615288664?pt=119039382&ct=elpwc&mt=8" target="_blank">
            <DownloadOnTheAppStoreIcon />
          </a>
        </div>
      </div>
    </div>

    <div class="item">
      <div class="title">
        <img src="./resource/images/dodo.png" width="40px" height="40px" alt="icon" style="border-radius: 8px; margin-right: 10px;" />

        <p class="titlep">艾尔登法环超级群 - DoDo社区</p>
      </div>
      <p>为艾尔登法环玩家准备的交流地，不管是攻略，还是道具图鉴都可以轻松找到~</p>
      <a href="https://imdodo.com/i?gNo=19255" target="_blank"> 点此跳转 </a>
    </div>
  </div>
</Modal>

<style>
  #modalContainer {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 40px;
  }

  #modalContainer p {
    color: rgb(228, 223, 210);
    margin: 10px 0;
  }
  a {
    color: rgb(228, 223, 210);
  }
  .item {
    padding: 5px;
  }
  .titlep {
    font-size: x-large;
  }
  .title {
    display: flex;
  }
</style>
