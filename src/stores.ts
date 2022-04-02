/**
 * Stores和全局变量
 * @author wniko
 */
import { Writable, writable } from 'svelte/store';
import type { MapPoint } from './utils/typings';
import { ConvertType } from 'zhconvertor';
import { persist } from './utils/persist';
import { locale } from 'svelte-i18n';
import type { SupportedLang } from './utils/enum';

// Stores

/** 是否是管理员Mode的store */
export let isAdminModeStore = writable(false);

/** 界面语言 */
export let lang = persist<SupportedLang>(locale as Writable<SupportedLang>, 'lang');

/** 内容语言转换 */
export let convertTargetStore = persist(writable<ConvertType>(ConvertType.dont), 'convertTarget');


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
