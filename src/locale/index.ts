import { addMessages, register, init, waitLocale } from 'svelte-i18n';
import { get } from 'svelte/store';
import { lang } from '../stores';
import { SupportedLang } from '../utils/enum';
import zhCN from './lang/zh-CN';

export async function setupI18n() {
  addMessages(SupportedLang.zhCN, zhCN);
  register(SupportedLang.zhTW, () => import('./lang/zh-TW'));
  register(SupportedLang.ja, () => import('./lang/ja'));
  init({
    fallbackLocale: SupportedLang.zhCN,
    initialLocale: get(lang),
  });
  return waitLocale();
}
