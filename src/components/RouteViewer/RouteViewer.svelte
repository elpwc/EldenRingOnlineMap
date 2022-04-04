<script lang="ts">
  import { onMount } from 'svelte';

  import { Box, BoxTypes } from './types';
  import { dagStratify, sugiyama, DagNode, zherebko, grid } from 'd3-dag';
  import Drawer from './drawer';
  import { boxes } from './data';

  onMount(() => {
    const data = Drawer.d3DagStratify(Drawer.getTree(boxes));
    const canvas = document.getElementById('routeCanvas') as HTMLCanvasElement;
    Drawer.draw(data.result, boxes, canvas);
  });
</script>

<div>
  <canvas id="routeCanvas" width="500px" height="1000px">你的浏览器不支持Canvas</canvas>
</div>

<style>
    canvas{
        background-color: rgb(21, 22, 17);
    }
</style>
