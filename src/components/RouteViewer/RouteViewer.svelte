<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import { Box, BoxTypes } from './types';
  import { dagStratify, sugiyama, DagNode, zherebko, grid } from 'd3-dag';
  import Drawer from './drawer';
  import { boxes } from './data';

  let range = { width: 0, height: 0 };
  let data;

  let rooms: { room: { data; lines: { x: number; y: number }[]; x; y } }[][] = [];

  const getRooms = () => {
      
  }

  onMount(() => {
    data = Drawer.d3DagStratify(Drawer.getTree(boxes));

    range = data.size;

    // const canvas = document.getElementById('routeCanvas') as HTMLCanvasElement;
  });

  afterUpdate(() => {
    const container = document.getElementById('rowContainer');
    Drawer.drawDOM(data.result, boxes, container, 100, 50);
  });
</script>

<div>
  <!--canvas id="routeCanvas" width="500px" height="1000px">你的浏览器不支持Canvas</canvas-->
  <div id="rowContainer">
    {#each new Array(range.height * 2) as h, j}
      <div class="row row{j}">
        {#each new Array(range.width * 2) as w, i}
          <div class="column column{i} row{j}">
            <p>{i}{j}</p>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  canvas {
    background-color: rgb(21, 22, 17);
  }
  #rowContainer {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
  }
  .column {
    width: -webkit-fill-available;
    height: 50px;
    border: solid 1px white;
    color: white;
  }
</style>
