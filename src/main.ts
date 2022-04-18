/**
 * 入口文件喵
 */
import axios from 'axios';
import App from './App.svelte';
import Config from './config';
import { set_client_ip } from './utils/utils';
import { setupI18n } from './locale';
import { transferOldStorage } from './stores';

// 设置api根目录
axios.defaults.baseURL = Config.APIBaseURL;

// 开发时 mock api 进行测试
async function bootstrap() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');  
    worker.start();
  }

  // 转移之前的storage
  transferOldStorage();
  // 设置语言
  setupI18n();

  // 获取ip到全局变量
  try {
    set_client_ip();
  } catch (e) {
    console.log(e);
  }
  
  // 启动
  new App({
    target: document.body,
    props: {},
  });
};

bootstrap();
