/**
 * 入口文件喵
 */
import axios from 'axios';
import App from './App.svelte';
import Config from './config';
import { set_client_ip } from './utils/utils';
import './common';
import { setupI18n } from './locale'
import { setUpConvertor } from './utils/convertor';

// 设置api根目录
axios.defaults.baseURL = Config.APIBaseURL;

// 获取ip到全局变量
try {
  set_client_ip();
} catch (e) {
  console.log(e);
}

setupI18n();
setUpConvertor();

const app = new App({
  target: document.body,
  props: {},
});

export default app;
