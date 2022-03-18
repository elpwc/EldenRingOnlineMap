import { addMessages, init, locale } from 'svelte-i18n';
import { get } from 'svelte/store';
import { SupportedLang } from '../utils/enum';

import zhCN from './lang/zh-CN'
import zhTW from './lang/zh-TW'

export function setupI18n() {
    addMessages(SupportedLang.zhCN, zhCN);
    addMessages(SupportedLang.zhTW, zhTW);
    init({
        fallbackLocale: SupportedLang.zhCN,
        initialLocale: localStorage.getItem('lang'),
    });
}

export const lang = {
    subscribe: (run: (value: SupportedLang) => void) => { return locale.subscribe(run) },
    switchTo: (lang: SupportedLang) => { locale.set(lang) }
}

export const changeLang = (target: SupportedLang) => {
    if (target != get(lang)) {
        lang.switchTo(target);
        localStorage.setItem('lang', target);
    }
};
