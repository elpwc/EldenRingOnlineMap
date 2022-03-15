/**
 * Stores和全局变量
 * @author wniko
 */
import { writable } from 'svelte/store';
import type { MapPoint } from './utils/typings';

// Stores

/** 当前页面的store */
export let currentPageStore = writable('home');
/** 是否是管理员Mode的store */
export let isAdminModeStore = writable(false);
/** 当前语言 */
export let langStore = writable('zhcn');

//全局变量

/** ip */
export let ip = '';
/** 设置ip */
export const setIp = newip => {
  ip = newip;
};

/** 是否是便携式设备 */
export const isMobile: boolean = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

/** 服务端获取到的所有markers */
export let allMarkers: MapPoint[] = [];
export let setAllMarkers = (markers: MapPoint[]) => {
  allMarkers = markers;
};
