import { addMessages, init } from 'svelte-i18n';
import { get } from 'svelte/store';
import { lang } from '../stores';
import { SupportedLang } from '../utils/enum';

import zhCN from './lang/zh-CN'
import zhTW from './lang/zh-TW'

export function setupI18n() {
    addMessages(SupportedLang.zhCN, zhCN);
    addMessages(SupportedLang.zhTW, zhTW);
    init({
        fallbackLocale: SupportedLang.zhCN,
        initialLocale: get(lang),
    });
}
