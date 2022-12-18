/**
 * 配置文件喵
 * @author wniko
 */
const Config = {
  APIBaseURL: './api/',
  currentVer: '3.3.0.4', // 本来想着稳定到3.1415926的，果然还是跳过了阿...
  lastUpdated: '2022-12-18 8:44',
  /** 是否锁定所有地标 */
  isLockAllMarkers: false,
  /** 是否在开发中，为true会导致一些界面上测试按钮被显示出来 */
  inDev: false,
  /** 是否第一次开启时显示更新内容页 */
  showUpdateModal: true,
};

export default Config;
