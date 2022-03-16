import { MapIcon } from '../components/icons';
import { MapPointType } from './enum';
import type LangZhcn from '../locale/zhcn';
/**
 * 所有筛选选项
 * @description hr: 是否是分割线，functional: 是否是功能性选项
 */
const getFilters = (Lang: typeof LangZhcn.siteTypes) => [
  { name: Lang.functionalFilters.myPoints, value: 'self', functional: true },
  { name: Lang.functionalFilters.myCollect, value: 'collect', functional: true },
  { name: Lang.functionalFilters.showHidden, value: 'hide', functional: true },
  { name: Lang.functionalFilters.hideBad, value: 'hidebad', functional: true },
  { name: Lang.functionalFilters.selectAll, value: 'all', functional: true },

  { name: Lang.filterGroupNames.sites, hr: true },
  { name: Lang.filters.cifu, value: MapPointType.Cifu, icon: MapIcon.cifu() },
  { name: Lang.filters.jiejing, value: MapPointType.Jiejing, icon: MapIcon.yellow() },
  { name: Lang.filters.portal, value: MapPointType.Portal, icon: MapIcon.portal() },
  { name: Lang.filters.soulsite, value: MapPointType.SoulSite, icon: MapIcon.yellow() },
  { name: Lang.filters.shop, value: MapPointType.Shop, icon: MapIcon.yellow() },
  { name: Lang.filters.npc, value: MapPointType.NPC, icon: MapIcon.yellow() },
  { name: Lang.filters.map, value: MapPointType.Map, icon: MapIcon.yellow() },
  { name: Lang.filters.lianji, value: MapPointType.Lianji, icon: MapIcon.yellow() },
  { name: Lang.filters.wind, value: MapPointType.Wind, icon: MapIcon.yellow() },
  { name: Lang.filters.cave, value: MapPointType.Cave, icon: MapIcon.yellow() },
  { name: Lang.filters.sword, value: MapPointType.Sword, icon: MapIcon.yellow() },
  { name: Lang.filters.temple, value: MapPointType.Temple, icon: MapIcon.yellow() },
  { name: Lang.filters.place, value: MapPointType.Place, icon: MapIcon.yellow() },

  { name: Lang.filterGroupNames.enemy, hr: true },
  { name: Lang.filters.bigboss, value: MapPointType.BigBoss, icon: MapIcon.boss() },
  { name: Lang.filters.boss, value: MapPointType.Boss, icon: MapIcon.boss() },
  { name: Lang.filters.littleboss, value: MapPointType.LittleBoss, icon: MapIcon.littleboss() },
  { name: Lang.filters.redsoul, value: MapPointType.RedSoul, icon: MapIcon.red() },
  { name: Lang.filters.jingyingguai, value: MapPointType.Jingyingguai, icon: MapIcon.red() },

  { name: Lang.filterGroupNames.items, hr: true },
  { name: Lang.filters.stone, value: MapPointType.Stone, icon: MapIcon.blue() },
  { name: Lang.filters.orchid, value: MapPointType.Orchid, icon: MapIcon.blue() },
  { name: Lang.filters.goldenseed, value: MapPointType.GoldenSeed, icon: MapIcon.blue(), noname: true },
  { name: Lang.filters.ludi, value: MapPointType.Ludi, icon: MapIcon.blue() },
  { name: Lang.filters.shengbeiludi, value: MapPointType.ShengbeiLudi, icon: MapIcon.blue() },
  { name: Lang.filters.bead, value: MapPointType.Bead, icon: MapIcon.blue() },
  { name: Lang.filters.key, value: MapPointType.Key, icon: MapIcon.blue(), noname: true },
  { name: Lang.filters.sigen, value: MapPointType.Sigen, icon: MapIcon.blue(), noname: true },
  { name: Lang.filters.metarial, value: MapPointType.Material, icon: MapIcon.blue() },
  { name: Lang.filters.importantitem, value: MapPointType.ImportantItem, icon: MapIcon.blue() },
  { name: Lang.filters.item, value: MapPointType.Item, icon: MapIcon.blue() },

  { name: Lang.filterGroupNames.collection, hr: true },
  { name: Lang.filters.gesture, value: MapPointType.Gesture, icon: MapIcon.blue() },
  { name: Lang.filters.paint, value: MapPointType.Paint, icon: MapIcon.blue() },

  { name: Lang.filterGroupNames.weapons, hr: true },
  { name: Lang.filters.magic, value: MapPointType.Magic, icon: MapIcon.purple() },
  { name: Lang.filters.daogao, value: MapPointType.Daogao, icon: MapIcon.purple() },
  { name: Lang.filters.weapon, value: MapPointType.Weapon, icon: MapIcon.purple() },
  { name: Lang.filters.clothes, value: MapPointType.Clothes, icon: MapIcon.purple() },
  { name: Lang.filters.ring, value: MapPointType.Ring, icon: MapIcon.purple() },
  { name: Lang.filters.zhanhui, value: MapPointType.Zhanhui, icon: MapIcon.purple() },
  { name: Lang.filters.guhui, value: MapPointType.Guhui, icon: MapIcon.purple() },

  { name: Lang.filterGroupNames.message, hr: true },
  { name: Lang.filters.text, value: MapPointType.Text, icon: MapIcon.message() },
  { name: Lang.filters.warn, value: MapPointType.Warn, icon: MapIcon.warning() },
  { name: Lang.filters.question, value: MapPointType.Question, icon: MapIcon.question() },
  { name: Lang.filters.taoke, value: MapPointType.Taoke, icon: MapIcon.message() },
];

export default getFilters;
