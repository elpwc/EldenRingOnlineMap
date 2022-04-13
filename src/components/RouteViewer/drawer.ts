import type { Box } from './types';
import { dagStratify, sugiyama, DagNode, zherebko, grid } from 'd3-dag';

export default class Drawer {
  public static currentClickedBoxId: number = 1;

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
   * @param onUpdate 返回的回调
   * @param scaleX X方向拉伸
   * @param scaleY Y方向拉伸
   * @description
   * node: {
   *  cachedChildrenCounts,
   *  data: {id: string, parentIds: string[]},
   *  dataChildren,
   *  value,
   *  x: number,
   *  y: number
   * }
   */
  public static draw = (
    node,
    boxes: Box[],
    onUpdate: (box: { top: number; left: number; box: Box }, links: { from: number; to: number; points: { x: number; y: number }[] }[]) => void,
    scaleX: number = 50,
    scaleY: number = 50
  ) => {
    // 获取box实例
    const instance = boxes.filter(f => {
      return f.id === Number(node.data.id);
    })?.[0];

    const links: { from: number; to: number; points: { x: number; y: number }[] }[] = [];

    // 画子节点的线
    /*
    child: {
      child:
      data:
      points: {x,y}[],
      reserved: boolean
    }
     */
    node?.dataChildren.forEach(child => {
      links.push({
        from: instance.id,
        to: Number(child?.child?.data.id),
        points: child?.points.map(p => {
          return { x: p.x * scaleX, y: p.y * scaleY };
        }),
      });

      // 递归到子节点
      this.draw(child?.child, boxes, onUpdate, scaleX, scaleY);
    });

    // 返回计算好的DOM属性
    onUpdate({ top: node.y * scaleY, left: node.x * scaleX, box: instance }, links);
  };
}
