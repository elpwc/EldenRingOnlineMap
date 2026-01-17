import { addMessages, register, init, waitLocale } from 'svelte-i18n';
import { get } from 'svelte/store';
import { lang } from '../stores';
import { SupportedLang } from '../utils/enum';

// for defaultly ja
// import ja from './lang/ja';

// export async function setupI18n() {
//   addMessages(SupportedLang.ja, ja);
//   register(SupportedLang.zhTW, () => import('./lang/zh-TW'));
//   register(SupportedLang.zhCN, () => import('./lang/zh-CN'));
//   init({
//     fallbackLocale: SupportedLang.ja,
//     initialLocale: get(lang),
//   });
//   return waitLocale();
// }

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
