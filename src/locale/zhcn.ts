export default {
  name: '简体中文',
  code: 'zhcn',
  title: '老头环地图 EldenRing Map',
  menu: {
    map: '地图',
    apo: '讯息',
    general: '设置',
    about: '说明',
  },

  map: {
    topright: {
      search: '搜索',
      add: '添加地标',
      placeholder: '搜索地标',
      result: '{result}个结果，点此清除结果',
      editModeHint: '在地图上点击一点添加坐标',
      editModeBtn: '退出编辑',
      changePositionModeHint: '在地图上选择新的位置',
    },
    left: {
      buttonBeforeOpen: '筛<br />选',
      buttonAfterOpen: '收<br />回',

      undergroundSwitcher1: '切换到地下地图',
      undergroundSwitcher2: '切换到地面地图',

      tips: 'tips:点击地图上的地标可以查看详细',

      showNameButton: '显示地名',

      fontSizeLabel: '字号',
      fontSizeSmall: '小',
      fontSizeMedium: '中',
      fontSizeLarge: '大',
    },
    modals: {
      add: {
        title: '添加一个地标',
        surface: '位于地面',
        underground: '位于地下',
        selector: '选择类型',
        namePlaceHolder: '名称',
        descPlaceHolder: '描述',
        reposition: '重新选择位置',
        btn1: '添加',
        btn1EditMode: '修改',
        btn2: '取消',
        editModeTitle: '修改 {title}',
      },
      info: {
        like: '给予好评',
        dislike: '给予恶评',
        edit: '编辑',
        delete: '删除',
        collect: '收藏',
        uncollect: '取消收藏',
        hide: '隐藏',
        lock: '锁定',
        btn1: '关闭',
      },
      delete: {
        btn1: '确认删除',
        btn2: '取消',
      },
    },
  },
  apothegm: {
    header: {
      placeholder: '搜索讯息',
      search: '搜索',
      result: '清楚结果',
      write: '写下讯息',
      my: '我发送的',
    },
    list: {
      replies: '回应',
      like: '好评',
      dislike: '恶评',
    },
    reply: {
      return: '返回',
      delete: '删除',
      share: '分享',
      reply: '回复',
    },

    modals: {
      add: {
        title: '写下讯息',
        selector: '选择类型',
        titlePlaceHolder: '标题',
        contentPlaceHolder: '内容',
        btn1: '写下讯息',
        btn2: '收回褪色者手指',
      },
      reply: {
        title: '写下对讯息的回应',
        contentPlaceHolder: '内容',
        btn1: '回应',
        btn2: '收回褪色者手指',
      },
      share: {
        title: '请长按复制',
        btn1: '返回',
      },
    },
  },
  general: {
    menulang: '菜单语言',
    maplang: '地图语言',
    dontConvert: '不转换',
  },

  about: {
    lastUpdate: '最近更新',
    coffee: '请一杯奶茶☕',
    feedback: '漏洞・意见反馈',
    github: 'GitHub页面',

    modals: {
      coffee: {
        text: '觉得帮到了自己的话，可以请咱喝一杯奶茶当作创作激励(',
        urlLink: './resource/images/qrcode.jpg',
        btn1: 'OK',
      },
    },
  },

  siteTypes: {
    functionalFilters: {
      myPoints: '我标注的',
      myCollect: '我的收藏',
      showHidden: '显示隐藏的',
      hideBad: '隐藏恶评',
      selectAll: '全选',
      hideBadTip: '请注意：此举会隐藏除了赐福外的所有恶评>好评的标注，一些实际上正确的标注也可能被包含在内!',
    },

    filterGroupNames: {
      sites: '地点',
      enemy: '敌人',
      items: '道具',
      collection: '收集',
      weapons: '武器',
      message: '留言',
    },

    filters: {
      cifu: '赐福',
      jiejing: '捷径',
      portal: '传送门',
      soulsite: '刷魂点',
      shop: '商店',
      npc: 'NPC',
      map: '地图碎片',
      lianji: '联机点',
      wind: '上升气流',
      cave: '洞窟',
      sword: '封印监牢',
      temple: '灵庙',
      place: '地点',
      bigboss: '半神BOSS',
      boss: 'BOSS(成就)',
      littleboss: '小BOSS',
      redsoul: '红灵入侵',
      jingyingguai: '精英怪',
      stone: '锻造石',
      orchid: '墓地铃兰',
      goldenseed: '黄金种子',
      ludi: '露滴',
      bead: '铃珠',
      key: '石剑钥匙',
      sigen: '死根',
      item: '道具',
      gesture: '姿态',
      paint: '画',
      magic: '魔法',
      daogao: '祷告',
      weapon: '武器',
      clothes: '装备',
      zhanhui: '战灰',
      guhui: '骨灰',
      text: '说明',
      warn: '警示',
      question: '求助',
      taoke: '逃课',
    },
  },

  apoTypes: {
    functionalFilters: {
      all: '全部',
      my: '我的',
    },

    filterGroupNames: {
      website: '网站相关',
      game: '游戏相关',
      others: '其他',
    },
    filters: {
      update: '更新',
      suggest: '建议',
      bug: 'Bug报道',
      strategy: '攻略',
      kokoroe: '心得',
      ask: '求助',
      message: '留言',
      water: '氵',
    },
  },
};
