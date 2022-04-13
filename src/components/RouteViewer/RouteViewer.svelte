<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import type { Box, BoxTypes } from './types';
  import Drawer from './drawer';
  import { boxes } from './data';
  import './box.css';

  // 初始化地图宽高
  /** 地图div宽度 */
  let winW: number = window.innerWidth;
  /** 地图div高度 */
  let winH: number = window.innerHeight;

  /** 图的长宽 */
  let range = { width: 0, height: 0 };
  /** 计算后的图 */
  let data;

  /** Box宽度 */
  const boxWidth = 100;
  /** Box高度 */
  const boxHeight = 50;

  onMount(() => {
    // 地图大小随窗口变化
    window.addEventListener('resize', e => {
      winW = window.innerWidth;
      winH = window.innerHeight;
    });

    // 获得计算后的图
    data = Drawer.d3DagStratify(Drawer.getTree(boxes));
    // 获得图的长宽
    range = { width: data.size.width * 2, height: data.size.height * 2 };
  });
  /** 全部Box */
  let resultBoxes: { top: number; left: number; box: Box }[] = [];
  /** 全部连线 */
  let resultLinks: { from: number; to: number; points: { x: number; y: number }[] }[] = [];

  /** 刷新显示 */
  const refreshRoutes = () => {
    resultBoxes = [];
    resultLinks = [];

    Drawer.draw(
      data.result,
      boxes,
      (box: { top: number; left: number; box: Box }, links: { from: number; to: number; points: { x: number; y: number }[] }[]) => {
        resultBoxes.push(box);
        resultBoxes = resultBoxes;
        resultLinks = [...resultLinks, ...links];
      },
      150,
      80
    );
  };

  afterUpdate(() => {
    // 绘制
    refreshRoutes();
  });
</script>

<div>
  <div id="routeContainer" style="height: {winH - 60}px;">
    <!--连接线-->
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {#each resultLinks as link}
        {#each link.points as point, i}
          {#if i > 0}
            <line x1={link.points[i - 1].x + boxWidth / 2} y1={link.points[i - 1].y + boxHeight / 2} x2={point.x + boxWidth / 2} y2={point.y + boxHeight / 2} />
          {/if}
        {/each}
      {/each}
    </svg>

    <!--框-->
    {#each resultBoxes as box}
      <div class="box box-type{box.box.type}" style="left: {box.left}px; top: {box.top}px; width: {boxWidth}px; height: {boxHeight}px">
        <p>{box.box.name}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  #routeContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    overflow: scroll;
  }
  .box {
    border: solid 1px rgb(208, 200, 181);
    color: rgb(234, 230, 219);
    position: absolute;
    background-color: black;
    z-index: 2;
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgb(60, 58, 54);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box p{
    margin: 0;
  }

  @media (any-hover: hover) {
    .box:hover {
      background-color: rgb(30, 30, 30);
      box-shadow: 0 0 10px 0 rgb(60, 58, 54);
    }
  }

  svg {
    position: absolute;
    z-index: 1;
  }
  svg line {
    stroke: rgb(208, 200, 181);
    stroke-width: 2;
  }
</style>
