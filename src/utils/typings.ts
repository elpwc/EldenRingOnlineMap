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

export type Apothegm = {
  id: number;
  content: string;
  tags: string;
  gesture: number;
  like: number;
  dislike: number;
  ip: string;
  is_deleted: boolean;
  create_date: string;
  update_date: string;
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
