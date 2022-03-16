export default {
  name: '正體中文',
  code: 'zhtw',
  title: '老頭環地圖 EldenRing Map',
  menu: {
    map: '地圖',
    apo: '訊息',
    general: '設定',
    about: '說明',
  },

  map: {
    topright: {
      search: '搜索',
      add: '添加地標',
      placeholder: '搜索地標',
      result: '{result}個結果，點此清除結果',
      editModeHint: '在地圖上點擊一點添加坐標',
      editModeBtn: '退出編輯',
      changePositionModeHint: '在地圖上選擇新的位置',
    },
    left: {
      buttonBeforeOpen: '篩<br />選',
      buttonAfterOpen: '收<br />回',

      undergroundSwitcher1: '切換到地下地圖',
      undergroundSwitcher2: '切換到地面地圖',

      tips: 'tips:點擊地圖上的地標可以查看詳細ㄛ~',

      showNameButton: '顯示地名',

      fontSizeLabel: '字號',
      fontSizeSmall: '小',
      fontSizeMedium: '中',
      fontSizeLarge: '大',
    },
    modals: {
      add: {
        title: '添加一個地標',
        surface: '位於地面',
        underground: '位於地下',
        selector: '選擇類型',
        namePlaceHolder: '名稱',
        descPlaceHolder: '描述',
        reposition: '重新選擇位置',
        btn1: '添加',
        btn1EditMode: '修改',
        btn2: '取消',
        editModeTitle: '修改 {title}',
      },
      info: {
        like: '給予好評',
        dislike: '給予惡評',
        edit: '編輯',
        delete: '刪除',
        collect: '收藏',
        uncollect: '取消收藏',
        hide: '隱藏',
        lock: '鎖定',
        btn1: '關閉',
      },
      delete: {
        btn1: '確認刪除',
        btn2: '取消',
      },
    },
  },
  apothegm: {
    header: {
      placeholder: '搜索訊息',
      search: '搜索',
      result: '清楚結果',
      write: '寫下訊息',
      my: '我發送的',
    },
    list: {
      replies: '回應',
      like: '好評',
      dislike: '惡評',
    },
    reply: {
      return: '返回',
      delete: '刪除',
      share: '分享',
      reply: '留言',
    },

    modals: {
      add: {
        title: '寫下訊息',
        selector: '選擇類型',
        titlePlaceHolder: '標題',
        contentPlaceHolder: '內容',
        btn1: '寫下訊息',
        btn2: '收回褪色者手指',
      },
      reply: {
        title: '寫下對訊息的回應',
        contentPlaceHolder: '內容',
        btn1: '回應',
        btn2: '收回褪色者手指',
      },
      share: {
        title: '請長按拷貝',
        btn1: '返回',
      },
    },
  },

  general: {
    menulang: '菜單語言',
    maplang: '地圖語言',
    dontConvert: '不轉換',
  },

  about: {
    lastUpdate: '最近更新',
    coffee: '請一杯奶茶☕',
    feedback: '漏洞・意見反饋',
    github: 'GitHub頁面',

    modals: {
      coffee: {
        text: '覺得幫到了自己的話，可以請咱喝一杯奶茶當作創作激勵(',
        urlLink: './resource/images/qrcode.jpg',
        btn1: 'OK',
      },
    },
  },

  siteTypes: {
    functionalFilters: {
      myPoints: '我標註的',
      myCollect: '我的收藏',
      showHidden: '顯示隱藏的',
      hideBad: '隱藏惡評',
      selectAll: '全選/全不選',
      hideBadTip: '請註意：此舉會隱藏除了賜福外的所有惡評>好評的標註，一些實際上正確的標註也可能被包含在內!',
    },

    filterGroupNames: {
      sites: '地點',
      enemy: '敵人',
      items: '道具',
      collection: '收集',
      weapons: '武器',
      message: '留言',
    },

    filters: {
      cifu: '賜福',
      jiejing: '捷徑',
      portal: '傳送門',
      soulsite: '刷魂點',
      shop: '商店',
      npc: 'NPC',
      map: '地圖碎片',
      lianji: '聯機點',
      wind: '上升氣流',
      cave: '洞窟',
      sword: '封印監牢',
      temple: '靈廟',
      place: '地點',
      bigboss: '半神BOSS',
      boss: 'BOSS(成就)',
      littleboss: '小BOSS',
      redsoul: '紅靈入侵',
      jingyingguai: '精英怪',
      stone: '鍛造石',
      orchid: '墓地鈴蘭',
      goldenseed: '黃金種子',
      ludi: '露滴',
      shengbeiludi: '聖杯露滴',
      bead: '鈴珠',
      key: '石劍鑰匙',
      sigen: '死根',
      item: '一般道具',
      gesture: '姿態',
      paint: '畫',
      magic: '魔法',
      daogao: '禱告',
      weapon: '武器',
      clothes: '裝備',
      zhanhui: '戰灰',
      guhui: '骨灰',
      text: '說明',
      warn: '警示',
      question: '求助',
      taoke: '逃課',
      importantitem: '重要道具',
    },
  },

  apoTypes: {
    functionalFilters: {
      all: '全部',
      my: '我的',
    },

    filterGroupNames: {
      website: '網站相關',
      game: '遊戲相關',
      others: '其他',
    },
    filters: {
      update: '更新',
      suggest: '建議',
      bug: 'Bug報道',
      strategy: '攻略',
      kokoroe: '心得',
      ask: '求助',
      message: '留言',
      water: '氵',
    },
  },
};
