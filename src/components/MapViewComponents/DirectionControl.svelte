<!--
    自定义调整位置控件
-->
<script lang="ts">
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
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
      </svg>
    </button>
  </div>

  <div class="directionControlLine">
    <button
      class="directionControlBtn left"
      on:click={() => {
        onClick('left');
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
      </svg>
    </button>
    <button
      class="directionControlBtn right"
      on:click={() => {
        onClick('right');
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
    </button>
  </div>

  <div class="directionControlLine">
    <button
      class="directionControlBtn bottom"
      on:click={() => {
        onClick('bottom');
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
      </svg>
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
