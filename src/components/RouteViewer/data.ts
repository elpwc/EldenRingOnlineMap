import { type Box, BoxTypes } from './types';

export const boxes: Box[] = [
  { id: 0, name: '开始', type: BoxTypes.Start, pids: [] },
  { id: 7, name: '史东薇尔城', type: BoxTypes.Position, pids: [{ id: 1, type: 0 }] },
  { id: 1, name: '噩兆', type: BoxTypes.Boss, pids: [{ id: 0, type: 0 }] },
  { id: 2, name: '接肢', type: BoxTypes.Boss, pids: [{ id: 7, type: 0 }] },
  { id: 3, name: '湖区', type: BoxTypes.Position, pids: [{ id: 2, type: 0 }] },
  { id: 4, name: '满月女王', type: BoxTypes.Boss, pids: [{ id: 13, type: 0 }] },
  { id: 8, name: '王城', type: BoxTypes.Position, pids: [{ id: 4, type: 0 }] },
  { id: 5, name: '初始之王', type: BoxTypes.Boss, pids: [{ id: 8, type: 0 }] },
  { id: 6, name: '雪山', type: BoxTypes.Position, pids: [{ id: 14, type: 0 }] },
  { id: 9, name: '菈妮', type: BoxTypes.NPC, pids: [{ id: 3, type: 0 }] },
  { id: 10, name: '狮子混种', type: BoxTypes.Boss, pids: [{ id: 0, type: 0 }] },
  {
    id: 11,
    name: '拉达恩',
    type: BoxTypes.Boss,
    pids: [
      { id: 0, type: 0 },
      { id: 12, type: 0 },
    ],
  },
  { id: 12, name: '壶哥', type: BoxTypes.NPC, pids: [{ id: 0, type: 0 }] },
  { id: 13, name: '红狼', type: BoxTypes.Boss, pids: [{ id: 3, type: 0 }] },
  { id: 14, name: '恶兆王', type: BoxTypes.Boss, pids: [{ id: 5, type: 0 }] },
  { id: 15, name: '泪滴哥', type: BoxTypes.Boss, pids: [{ id: 11, type: 0 }] },
  { id: 16, name: '英雄石像鬼', type: BoxTypes.Boss, pids: [{ id: 11, type: 0 }] },
  {
    id: 17,
    name: '死龙',
    type: BoxTypes.Boss,
    pids: [
      { id: 18, type: 0 },
      { id: 16, type: 0 },
    ],
  },
  { id: 18, name: '死眠', type: BoxTypes.NPC, pids: [{ id: 0, type: 0 }] },
];
