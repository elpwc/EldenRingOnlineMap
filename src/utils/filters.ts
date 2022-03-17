import { MapIcon } from '../components/icons';
import { ApothegmType, MapPointType } from './enum';

/**
 * 所有筛选选项
 * @description hr: 是否是分割线，functional: 是否是功能性选项
 */
export const getSiteTypeFilters = ($t) => [
    { name: $t('siteTypes.functionalFilters.myPoints'), value: 'self', functional: true },
    { name: $t('siteTypes.functionalFilters.myCollect'), value: 'collect', functional: true },
    { name: $t('siteTypes.functionalFilters.showHidden'), value: 'hide', functional: true },
    { name: $t('siteTypes.functionalFilters.hideBad'), value: 'hidebad', functional: true },
    { name: $t('siteTypes.functionalFilters.selectAll'), value: 'all', functional: true },

    { name: $t('siteTypes.filterGroupNames.sites'), hr: true },
    { name: $t('siteTypes.filters.cifu'), value: MapPointType.Cifu, icon: MapIcon.cifu() },
    { name: $t('siteTypes.filters.jiejing'), value: MapPointType.Jiejing, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.portal'), value: MapPointType.Portal, icon: MapIcon.portal() },
    { name: $t('siteTypes.filters.soulsite'), value: MapPointType.SoulSite, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.shop'), value: MapPointType.Shop, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.npc'), value: MapPointType.NPC, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.map'), value: MapPointType.Map, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.lianji'), value: MapPointType.Lianji, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.wind'), value: MapPointType.Wind, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.cave'), value: MapPointType.Cave, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.sword'), value: MapPointType.Sword, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.temple'), value: MapPointType.Temple, icon: MapIcon.yellow() },
    { name: $t('siteTypes.filters.place'), value: MapPointType.Place, icon: MapIcon.yellow() },

    { name: $t('siteTypes.filterGroupNames.enemy'), hr: true },
    { name: $t('siteTypes.filters.bigboss'), value: MapPointType.BigBoss, icon: MapIcon.boss() },
    { name: $t('siteTypes.filters.boss'), value: MapPointType.Boss, icon: MapIcon.boss() },
    { name: $t('siteTypes.filters.littleboss'), value: MapPointType.LittleBoss, icon: MapIcon.littleboss() },
    { name: $t('siteTypes.filters.redsoul'), value: MapPointType.RedSoul, icon: MapIcon.red() },
    { name: $t('siteTypes.filters.jingyingguai'), value: MapPointType.Jingyingguai, icon: MapIcon.red() },

    { name: $t('siteTypes.filterGroupNames.items'), hr: true },
    { name: $t('siteTypes.filters.stone'), value: MapPointType.Stone, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.orchid'), value: MapPointType.Orchid, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.goldenseed'), value: MapPointType.GoldenSeed, icon: MapIcon.blue(), noname: true },
    { name: $t('siteTypes.filters.ludi'), value: MapPointType.Ludi, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.shengbeiludi'), value: MapPointType.ShengbeiLudi, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.bead'), value: MapPointType.Bead, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.key'), value: MapPointType.Key, icon: MapIcon.blue(), noname: true },
    { name: $t('siteTypes.filters.sigen'), value: MapPointType.Sigen, icon: MapIcon.blue(), noname: true },
    { name: $t('siteTypes.filters.metarial'), value: MapPointType.Material, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.importantitem'), value: MapPointType.ImportantItem, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.item'), value: MapPointType.Item, icon: MapIcon.blue() },

    { name: $t('siteTypes.filterGroupNames.collection'), hr: true },
    { name: $t('siteTypes.filters.gesture'), value: MapPointType.Gesture, icon: MapIcon.blue() },
    { name: $t('siteTypes.filters.paint'), value: MapPointType.Paint, icon: MapIcon.blue() },

    { name: $t('siteTypes.filterGroupNames.weapons'), hr: true },
    { name: $t('siteTypes.filters.magic'), value: MapPointType.Magic, icon: MapIcon.purple() },
    { name: $t('siteTypes.filters.daogao'), value: MapPointType.Daogao, icon: MapIcon.purple() },
    { name: $t('siteTypes.filters.weapon'), value: MapPointType.Weapon, icon: MapIcon.purple() },
    { name: $t('siteTypes.filters.clothes'), value: MapPointType.Clothes, icon: MapIcon.purple() },
    { name: $t('siteTypes.filters.ring'), value: MapPointType.Ring, icon: MapIcon.purple() },
    { name: $t('siteTypes.filters.zhanhui'), value: MapPointType.Zhanhui, icon: MapIcon.purple() },
    { name: $t('siteTypes.filters.guhui'), value: MapPointType.Guhui, icon: MapIcon.purple() },

    { name: $t('siteTypes.filterGroupNames.message'), hr: true },
    { name: $t('siteTypes.filters.text'), value: MapPointType.Text, icon: MapIcon.message() },
    { name: $t('siteTypes.filters.warn'), value: MapPointType.Warn, icon: MapIcon.warning() },
    { name: $t('siteTypes.filters.question'), value: MapPointType.Question, icon: MapIcon.question() },
    { name: $t('siteTypes.filters.taoke'), value: MapPointType.Taoke, icon: MapIcon.message() },
];

/**
   * 所有筛选选项
   * @description hr: 是否是分割线，functional: 是否是功能性选项
   */
export const getApoFilters = ($t) => [
    { name: $t('apoTypes.functionalFilters.all'), value: 'all', color: '', show: false, functional: true },
    { name: $t('apoTypes.functionalFilters.my'), value: 'my', color: '', show: false, functional: true },

    { name: $t('apoTypes.filterGroupNames.website'), hr: true },
    { name: $t('apoTypes.filters.update'), value: ApothegmType.Feature, color: 'yellow', show: true, admin: true },
    { name: $t('apoTypes.filters.suggest'), value: ApothegmType.Suggest, color: 'orange', show: true },
    { name: $t('apoTypes.filters.bug'), value: ApothegmType.BugReport, color: '#ff3535', show: true },

    { name: $t('apoTypes.filterGroupNames.game'), hr: true },
    { name: $t('apoTypes.filters.strategy'), value: ApothegmType.Strategy, color: '#10d118', show: true },
    { name: $t('apoTypes.filters.kokoroe'), value: ApothegmType.Kokoroe, color: '#85ff00', show: true },
    { name: $t('apoTypes.filters.ask'), value: ApothegmType.Ask, color: '#f44aff', show: true },

    { name: $t('apoTypes.filterGroupNames.others'), hr: true },
    { name: $t('apoTypes.filters.message'), value: ApothegmType.Message, color: 'default', show: false },
    { name: $t('apoTypes.filters.water'), value: ApothegmType.Water, color: '#03a9f4', show: true },
];