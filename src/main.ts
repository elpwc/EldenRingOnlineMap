/**
 * 入口文件喵
 */
import axios from 'axios';
import App from './App.svelte';
import Config from './config';
import { getCookie, setCookie, set_client_ip } from './utils/utils';
import './common';
import { setupI18n } from './locale';
import { setUpConvertor } from './utils/convertor';

// 设置api根目录
axios.defaults.baseURL = Config.APIBaseURL;

// 获取ip到全局变量
try {
  set_client_ip();
} catch (e) {
  console.log(e);
}

// 旧cookie中的lang导入localStorage
if (getCookie('lang') !== '') {
  localStorage.setItem('lang', getCookie('lang'));
  setCookie('lang', '', 0);
}

// 设置语言
setupI18n();
setUpConvertor();

// 启动
const app = new App({
  target: document.body,
  props: {},
});

export default app;
