/**
 * 入口文件喵
 */
import App from './App.svelte';
import { setIp } from './stores';
import { get_ip_position } from './utils/utils';

// 获取ip到全局变量
setIp(get_ip_position().cip);

const app = new App({
  target: document.body,
  props: {},
});

export default app;
