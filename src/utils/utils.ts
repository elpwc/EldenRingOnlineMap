import type { GetIPPositionReturn } from "./typings";

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
