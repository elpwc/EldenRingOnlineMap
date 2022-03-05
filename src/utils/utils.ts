/**
 * 工具类喵
 * @author wniko
 */
import axios from 'axios';
import { setIp } from '../stores';
import type { GetIPPositionReturn } from './typings';

/**
 * 获取IP和地址
 * @returns
 * @author wniko
 */
export const get_ip_position = (): GetIPPositionReturn => {
  // 判断是否可用，如果浏览去开启拦截广告，就不会读取，导致错误
  // @ts-ignore
  if (returnCitySN) {
    // @ts-ignore
    const value = returnCitySN; // 见index.html <script src="https://pv.sohu.com/cityjson?ie=utf-8"></script>
    if (value) {
      return value as GetIPPositionReturn;
    }
  } else {
    return {
      cip: '',
      cid: '',
      cname: '',
    };
  }
};

/**
 * 设置用户ip
 */
export const set_client_ip = () => {
  axios.get('./ipRequest.php').then(res => {
    setIp(res?.data?.ip);
  });
};

/**
 * 设置Cookie
 * @param cname 名
 * @param cvalue 值
 * @param exdays 死亡日
 */
export const setCookie = (cname: string, cvalue: any, exdays: number = 30) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
};

/**
 * 读取Cookie
 * @param cname 名
 * @returns 值
 */
export const getCookie = (cname: string): string => {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
};
