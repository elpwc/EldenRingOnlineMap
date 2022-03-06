/**
 * Stores和全局变量
 * @author wniko
 */
import { writable } from 'svelte/store';

// Stores

/** 当前页面的store */
export let currentPageStore = writable('home');
/** 是否是管理员Mode的store */
export let isAdminModeStore = writable(false);

//全局变量

/** ip */
export let ip = '';
/** 设置ip */
export const setIp = newip => {
  ip = newip;
};

/** 是否是便携式设备 */
export const isMobile: boolean = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
