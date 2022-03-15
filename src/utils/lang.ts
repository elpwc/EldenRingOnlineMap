import LangZhcn from '../locale/zhcn';
import LangZhtw from '../locale/zhtw';

/**
 * 获取语言
 * @param langcode 语言代码 zhcn|zhtw
 * @returns 语言对象
 * @author wniko
 */
const getLang = (langcode: string): typeof LangZhcn => {
  switch (langcode) {
    case 'zhcn':
      return LangZhcn as typeof LangZhcn;
    case 'zhtw':
      return LangZhtw as typeof LangZhcn;
    default:
      return LangZhcn as typeof LangZhcn;
  }
};

export default getLang;
