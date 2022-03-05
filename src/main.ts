/**
 * 入口文件喵
 */
import App from './App.svelte';
import { set_client_ip } from './utils/utils';

// 获取ip到全局变量
try {
  set_client_ip();
} catch (e) {
  console.log(e);
}

const app = new App({
  target: document.body,
  props: {},
});

export default app;
