import type { Box } from './types';
import { dagStratify, sugiyama, DagNode, zherebko, grid } from 'd3-dag';
import { BoxStyles } from './styles';

export default class Drawer {
  /**
   * 将自定义DAG格式转化为D3-DAG格式
   * @param boxes
   * @returns
   */
  public static getTree = (boxes: Box[]) => {
    return boxes.map(box => {
      return {
        id: String(box.id),
        parentIds: box.pids.map(pid => {
          return String(pid.id);
        }),
      };
    });
  };

  /**
   * D3-dag处理getTree的结果
   * @param data
   * @returns 返回结果和结果的长宽
   */
  public static d3DagStratify = (data): { result; size: { width: number; height: number } } => {
    const stratify = dagStratify();
    const dag: DagNode = stratify(data) as DagNode;
    const layout = sugiyama();
    const sugiyamainfo = layout(dag);

    return { result: dag, size: sugiyamainfo };
  };

  /**
   * 画！（一个节点和他的子节点
   * @param node 节点
   * @param boxes 所有box
   * @param canvas canvasDOM
   * @param scaleX X方向拉伸
   * @param scaleY Y方向拉伸
   */
  public static draw = (node, boxes: Box[], canvas: HTMLCanvasElement, scaleX: number = 50, scaleY: number = 50) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    // 获取box实例
    const instance = boxes.filter(f => {
      return f.id === Number(node.data.id);
    })?.[0];

    // 获取style
    const boxStyle = BoxStyles.filter(f => {
      return f.type === instance.type;
    })?.[0];

    // 画图标
    ctx.beginPath();
    ctx.arc(node.x * scaleX, node.y * scaleY, 5, 0, 2 * Math.PI);
    ctx.stroke();

    // 设置字体
    ctx.font = boxStyle.font;
    ctx.fillStyle = boxStyle.color ?? 'white';
    // 画文字
    ctx.fillText(instance.name, node.x * scaleX + 5, node.y * scaleY);

    // 画子节点的线
    node?.dataChildren.forEach(child => {
      child?.points.forEach((p, i) => {
        if (i > 0) {
          ctx.moveTo(child?.points[i - 1].x * scaleX, child?.points[i - 1].y * scaleY);
          ctx.lineTo(p.x * scaleX, p.y * scaleY);
          ctx.strokeStyle = 'white';
          ctx.stroke();
        }
      });

      // 递归到子节点
      this.draw(child?.child, boxes, canvas, scaleX, scaleY);
    });
  };
}
