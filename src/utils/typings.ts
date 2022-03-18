/**
 * 这个文件用来定义各种类型喵
 * @author wniko
 */
import type { ApothegmType, MapPointType } from './enum';

/** 地标 */
export type MapPoint = {
  id: number;
  type: MapPointType;
  name: string;
  desc: string;
  lng: number;
  lat: number;
  like: number;
  dislike: number;
  delete_request: number;
  ip: string;
  is_deleted: boolean;
  is_lock: boolean;
  is_underground: boolean;
  create_date: string;
  update_date: string;
};

/** 讯息回复 */
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

/** 讯息 */
export type Apothegm = {
  id: number;
  title: string;
  content: string;
  type: ApothegmType;
  gesture: number;
  is_top: boolean;
  like: number;
  dislike: number;
  ip: string;
  is_deleted: boolean;
  create_date: string;
  update_date: string;
  reply_date: string;
  /** 回复 */
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
