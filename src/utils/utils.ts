import type { GetIPPositionReturn } from './typings';

/**
 * 获取IP和地址
 * @returns
 * @author wniko
 */
export const get_ip_position = (): GetIPPositionReturn => {
  // @ts-ignore
  const value = returnCitySN; // 见index.html <script src="https://pv.sohu.com/cityjson?ie=utf-8"></script>
  if (value) {
    return value as GetIPPositionReturn;
  }
};

export const setCookie = (cname, cvalue, exdays = 30) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
};

export const getCookie = cname => {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
};
