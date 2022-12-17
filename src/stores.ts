/**
 * Stores和全局变量
 * @author wniko
 */
import { get, Writable, writable } from 'svelte/store';
import type { MapPoint } from './utils/typings';
import { ConvertType } from 'zhconvertor';
import { persist, PersistentStore } from './utils/persist';
import { locale } from 'svelte-i18n';
import type { SupportedLang } from './utils/enum';
import { getCookie, setCookie } from './utils/utils';
import Config from './config';

// Stores

/** 是否是管理员Mode的store */
export let isAdminModeStore = writable(false);

/** 界面语言 */
export let lang = persist<SupportedLang>(locale as Writable<SupportedLang>, 'lang');

/** 内容语言转换 */
export let convertTargetStore = persist(writable<ConvertType>(ConvertType.dont), 'convertTarget');

// id集合类
class pointSet {
  store: PersistentStore<Set<number>>;
  constructor(key: string) {
    this.store = persist(writable<Set<number>>(new Set()), key);
  }
  public getStore() {
    const getPoints = () => {
      return get(this.store);
    };
    const setPoints = (points: Set<number>) => {
      this.store.set(points);
    };
    const addPoint = (p: number) => {
      setPoints(getPoints().add(p));
    };
    const addPoints = (ps: number[] | Set<number>) => {
      ps.forEach((p: number) => {
        getPoints().add(p);
      });
      setPoints(getPoints());
    };
    const removePoint = (p: number) => {
      getPoints().delete(p);
      setPoints(getPoints());
    };
    const clear = () => {
      setPoints(new Set());
    };
    return {
      getPoints,
      addPoint,
      addPoints,
      removePoint,
      clear,
      ...this.store,
    };
  }
}

/** 收藏点的id集合 */
export let collectionSet = new pointSet('collections');

/** 隐藏点的id集合 */
export let hiddenSet = new pointSet('hiddens');

// 检查旧的本地存储是否转移完毕
let version = persist(writable('' as string), 'version');
export function transferOldStorage() {
  if (!get(version)) {
    if (getCookie('lang') !== '') {
      localStorage.setItem('lang', getCookie('lang'));
      setCookie('lang', '', 0);
    }

    {
      // collections
      let old: string = '';
      if (getCookie('collect') !== '') {
        old += getCookie('collect') + '|';
        setCookie('collect', '', 0);
      }
      old += localStorage.getItem('collect') ?? '';

      const transafered = old?.split('|') ?? [];
      if (transafered.length > 0) {
        collectionSet.getStore().addPoints(transafered.filter(s => s).map(s => Number(s)));
      }
      // 先不删，怕出问题
      // localStorage.removeItem('collect');
    }

    {
      // hiddens
      let old: string = '';
      if (getCookie('hidden') !== '') {
        old += getCookie('hidden') + '|';
        setCookie('hidden', '', 0);
      }
      old += localStorage.getItem('hidden') ?? '';

      const transafered = old?.split('|') ?? [];
      if (transafered.length > 0) {
        hiddenSet.getStore().addPoints(transafered.filter(s => s).map(s => Number(s)));
      }
      // 先不删，怕出问题
      // localStorage.removeItem('hidden');
    }

    // 转移完毕
    version.set(Config.currentVer);
  }
}

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
