import { ApothegmType } from './enum';
import type LangZhcn from '../locale/zhcn';

/**
 * 所有筛选选项
 * @description hr: 是否是分割线，functional: 是否是功能性选项
 */
const getApoFilters = (Lang: typeof LangZhcn.apoTypes) => [
  { name: Lang.functionalFilters.all, value: 'all', color: '', show: false, functional: true },
  { name: Lang.functionalFilters.my, value: 'my', color: '', show: false, functional: true },

  { name: Lang.filterGroupNames.website, hr: true },
  { name: Lang.filters.update, value: ApothegmType.Feature, color: 'yellow', show: true, admin: true },
  { name: Lang.filters.suggest, value: ApothegmType.Suggest, color: 'orange', show: true },
  { name: Lang.filters.bug, value: ApothegmType.BugReport, color: '#ff3535', show: true },

  { name: Lang.filterGroupNames.game, hr: true },
  { name: Lang.filters.strategy, value: ApothegmType.Strategy, color: '#10d118', show: true },
  { name: Lang.filters.kokoroe, value: ApothegmType.Kokoroe, color: '#85ff00', show: true },
  { name: Lang.filters.ask, value: ApothegmType.Ask, color: '#f44aff', show: true },

  { name: Lang.filterGroupNames.others, hr: true },
  { name: Lang.filters.message, value: ApothegmType.Message, color: 'default', show: false },
  { name: Lang.filters.water, value: ApothegmType.Water, color: '#03a9f4', show: true },
];

export default getApoFilters;
