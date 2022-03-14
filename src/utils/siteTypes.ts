import { MapIcon } from '../components/icons';
import { MapPointType } from './enum';

/**
 * 所有筛选选项
 * @description hr: 是否是分割线，functional: 是否是功能性选项
 */
const filters = [
  { name: '我标注的', value: 'self', functional: true },
  { name: '我的收藏', value: 'collect', functional: true },
  { name: '显示隐藏的', value: 'hide', functional: true },
  { name: '隐藏恶评', value: 'hidebad', functional: true },
  { name: '全选', value: 'all', functional: true },

  { name: '地点', hr: true },
  { name: '赐福', value: MapPointType.Cifu, icon: MapIcon.cifu() },
  { name: '捷径', value: MapPointType.Jiejing, icon: MapIcon.yellow() },
  { name: '传送门', value: MapPointType.Portal, icon: MapIcon.portal() },
  { name: '刷魂点', value: MapPointType.SoulSite, icon: MapIcon.yellow() },
  { name: '商店', value: MapPointType.Shop, icon: MapIcon.yellow() },
  { name: 'NPC', value: MapPointType.NPC, icon: MapIcon.yellow() },
  { name: '地图碎片', value: MapPointType.Map, icon: MapIcon.yellow() },
  { name: '联机点', value: MapPointType.Lianji, icon: MapIcon.yellow() },
  { name: '上升气流', value: MapPointType.Wind, icon: MapIcon.yellow() },
  { name: '洞窟', value: MapPointType.Cave, icon: MapIcon.yellow() },
  { name: '封印监牢', value: MapPointType.Sword, icon: MapIcon.yellow() },
  { name: '灵庙', value: MapPointType.Temple, icon: MapIcon.yellow() },
  { name: '地点', value: MapPointType.Place, icon: MapIcon.yellow() },

  { name: '敌人', hr: true },
  { name: '半神BOSS', value: MapPointType.BigBoss, icon: MapIcon.boss() },
  { name: 'BOSS(成就)', value: MapPointType.Boss, icon: MapIcon.boss() },
  { name: '小BOSS', value: MapPointType.LittleBoss, icon: MapIcon.littleboss() },
  { name: '红灵入侵', value: MapPointType.RedSoul, icon: MapIcon.red() },
  { name: '精英怪', value: MapPointType.Jingyingguai, icon: MapIcon.red() },

  { name: '道具', hr: true },
  { name: '锻造石', value: MapPointType.Stone, icon: MapIcon.blue() },
  { name: '黄金种子', value: MapPointType.GoldenSeed, icon: MapIcon.blue(), noname: true },
  { name: '露滴', value: MapPointType.Ludi, icon: MapIcon.blue() },
  { name: '铃珠', value: MapPointType.Bead, icon: MapIcon.blue() },
  { name: '道具', value: MapPointType.Item, icon: MapIcon.blue() },
  { name: '石剑钥匙', value: MapPointType.Key, icon: MapIcon.blue() , noname: true},
  { name: '死根', value: MapPointType.Sigen, icon: MapIcon.blue(), noname: true },

  { name: '收集', hr: true },
  { name: '姿态', value: MapPointType.Gesture, icon: MapIcon.blue() },
  { name: '画', value: MapPointType.Paint, icon: MapIcon.blue() },

  { name: '武器', hr: true },
  { name: '魔法', value: MapPointType.Magic, icon: MapIcon.purple() },
  { name: '祷告', value: MapPointType.Daogao, icon: MapIcon.purple() },
  { name: '武器', value: MapPointType.Weapon, icon: MapIcon.purple() },
  { name: '装备', value: MapPointType.Clothes, icon: MapIcon.purple() },
  { name: '战灰', value: MapPointType.Zhanhui, icon: MapIcon.purple() },
  { name: '骨灰', value: MapPointType.Guhui, icon: MapIcon.purple() },

  { name: '留言', hr: true },
  { name: '说明', value: MapPointType.Text, icon: MapIcon.message() },
  { name: '警示', value: MapPointType.Warn, icon: MapIcon.warning() },
  { name: '求助', value: MapPointType.Question, icon: MapIcon.question() },
  { name: '逃课', value: MapPointType.Taoke, icon: MapIcon.message() },
];

export default filters;
