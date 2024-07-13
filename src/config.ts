/**
 * 配置文件喵
 * @author wniko
 */
const Config = {
  APIBaseURL: './api/',
  currentVer: '3.3.1.3', // 本来想着稳定到3.1415926的，果然还是跳过了阿...
  lastUpdated: '2024-6-23 4:50 UT+8',
  /** 是否锁定所有地标 */
  isLockAllMarkers: false,
  /** 是否在开发中，为true会导致一些界面上测试按钮被显示出来，并显示测试用地标 */
  inDev: true,
  /** 是否使用测试用数据 */
  useTestData:false,
  /** 是否第一次开启时显示更新内容页 */
  showUpdateModal: true,
};

export default Config;
