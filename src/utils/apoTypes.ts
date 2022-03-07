import { MapIcon } from '../components/icons';
import { ApothegmType, MapPointType } from './enum';

/**
 * 所有筛选选项
 * @description hr: 是否是分割线，functional: 是否是功能性选项
 */
const apo_filters = [
  { name: '全部', value: 'all', color: '', show: false, functional: true },
  { name: '我的', value: 'my', color: '', show: false, functional: true },

  { name: '网站相关', hr: true },
  { name: '更新', value: ApothegmType.Feature, color: 'yellow', show: true, admin: true },
  { name: '建议', value: ApothegmType.Suggest, color: 'orange', show: true },
  { name: 'Bug报道', value: ApothegmType.BugReport, color: '#ff3535', show: true },

  { name: '游戏相关', hr: true },
  { name: '攻略', value: ApothegmType.Strategy, color: '#10d118', show: true },
  { name: '心得', value: ApothegmType.Kokoroe, color: '#85ff00', show: true },
  { name: '求助', value: ApothegmType.Ask, color: '#f44aff', show: true },

  { name: '其他', hr: true },
  { name: '留言', value: ApothegmType.Message, color: 'default', show: false },
  { name: '氵', value: ApothegmType.Water, color: '#03a9f4', show: true },
];

export default apo_filters;
