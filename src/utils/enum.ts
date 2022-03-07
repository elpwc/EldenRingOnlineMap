/**
 * 这个文件用来存各种enum喵
 * @author wniko
 */

/**
 * 地标类型
 */
export enum MapPointType {
  Empty = '',

  Cifu = 'cifu',
  Jiejing = 'pass',
  Portal = 'portal',
  SoulSite = 'soulsite',
  Shop = 'shop',
  NPC = 'npc',
  Map = 'map',
  Place = 'place',
  Lianji = 'lianji',

  Boss = 'boss',
  LittleBoss = 'littboss',
  RedSoul = 'redsoul',
  Jingyingguai = 'jingying',

  Item = 'item',
  Stone = 'stone',
  GoldenSeed = 'goldseed',
  Ludi = 'ludi',
  Key = 'key',
  Sigen = 'sigen',

  Magic = 'magic',
  Weapon = 'weapon',
  Daogao = 'daogao',
  Clothes = 'clothes',
  Zhanhui = 'zhanhui',
  Guhui = 'guhui',

  Text = 'text',
  Warn = 'warn',
  Question = 'question',
  Taoke = 'taoke',
}

/**
 * 讯息类型
 */
export enum ApothegmType {
  Empty = '',

  Feature = 'feature',
  Suggest = 'suggest',
  BugReport = 'bug',

  Strategy = 'strategy',
  Kokoroe = 'kokoroe',
  Ask = 'ask',

  Message = 'message',

  Water = 'water',
}
