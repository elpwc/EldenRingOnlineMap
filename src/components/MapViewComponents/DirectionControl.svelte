<!--
    自定义调整位置控件
-->
<script lang="ts">
  import UpArrow from '../../assets/icons/icon-up-arrow.svg';
  import DownArrow from '../../assets/icons/icon-down-arrow.svg';
  import LeftArrow from '../../assets/icons/icon-left-arrow.svg';
  import RightArrow from '../../assets/icons/icon-right-arrow.svg';

  export let onClick: (direction: string) => void = () => {};
  export let style: string = '';
</script>

<div id="directionControlContainer" {style}>
  <div class="directionControlLine">
    <button
      class="directionControlBtn up"
      on:click={() => {
        onClick('up');
      }}
    >
      <UpArrow />
    </button>
  </div>

  <div class="directionControlLine">
    <button
      class="directionControlBtn left"
      on:click={() => {
        onClick('left');
      }}
    >
      <LeftArrow />
    </button>
    <button
      class="directionControlBtn right"
      on:click={() => {
        onClick('right');
      }}
    >
      <RightArrow />
    </button>
  </div>

  <div class="directionControlLine">
    <button
      class="directionControlBtn bottom"
      on:click={() => {
        onClick('bottom');
      }}
    >
      <DownArrow />
    </button>
  </div>
</div>

<style>
  #directionControlContainer {
    display: flex;
    flex-direction: column;
    width: fit-content;
  }
  .directionControlLine {
    display: flex;
    justify-content: center;
  }
  .directionControlBtn {
    width: 30px;
    height: 25px;
    line-height: 30px;
    background-color: white;
    color: black;
    box-shadow: none;
    cursor: pointer;
  }
  .directionControlBtn:active {
    background-color: rgb(224, 224, 224);
  }
  .up,
  .bottom {
    height: 25px;
    width: 30px;
  }
  .up {
    border-radius: 3px 3px 0 0;
    border-bottom-color: #ccc;
  }
  .left {
    border-radius: 3px 0 0 3px;
    border-right-color: #ccc;
  }
  .right {
    border-radius: 0 3px 3px 0;
    border-left-color: #ccc;
  }
  .bottom {
    border-radius: 0 0 3px 3px;
    border-top-color: #ccc;
  }
</style>
