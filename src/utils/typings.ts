import type { MapPointType } from './enum';

export type MapPoint = {
  id: number;
  type: MapPointType;
  name: string;
  desc: string;
  lng: number;
  lat: number;
  like: number;
  dislike: number;
  ip: string;
  is_deleted: boolean;
  is_lock: boolean;
  is_underground: boolean;
  create_date: string;
  update_date: string;
};

export type Reply = {
  id: number;
  pid: number;
  content: string;
  like: number;
  dislike: number;
  ip: string;
  is_deleted: boolean;
  create_date: string;
  update_date: string;
};

export type Apothegm = {
  id: number;
  title: string;
  content: string;
  tags: string;
  gesture: number;
  like: number;
  dislike: number;
  ip: string;
  is_deleted: boolean;
  create_date: string;
  update_date: string;
  reply_date: string;
  replies: Reply[];
};

/**
 * 获取IP/地址结果
 */
export type GetIPPositionReturn = {
  /** IP */
  cip: string;
  /** 行政区划编码 */
  cid: string;
  /** 位置 */
  cname: string;
};
