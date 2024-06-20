const lang = {
  name: '简体中文',
  title: '老头环地图 EldenRing Map',
  menu: {
    map: '地图',
    apo: '讯息',
    routes: '支线(预览)',
    general: '设置',
    about: '说明',
    tdmap: '3D地图(dev)',
  },
  map: {
    loading: {
      loading: '加载中',
      renderring: '渲染中',
    },
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
      mapSwitcher: '切换地面/地底/DLC地图',
      undergroundSwitcher1: '切换到地下地图',
      undergroundSwitcher2: '切换到地面地图',
      surface: '在地表的',
      cave: '在洞穴的',
      afterBurning: '灰城的',
      tips: '点击地图上的地标可以查看详细|右键or长按地标可以快速隐藏/收藏|可以在"编辑"里移动地标|在设置里可以繁简切换|遇到bug请反馈到讯息里捏|"隐藏恶评"可以不显示恶评较多的地标',
      showNameButton: '显示地名',
      fontSizeLabel: '字号',
      fontSizeSmall: '小',
      fontSizeMedium: '中',
      fontSizeLarge: '大',
    },
    bottom: {
      developerAndProvider: '开发&提供',
      donate: '给服务器续命',
    },
    modals: {
      add: {
        title: '添加一个地标',
        surface: '位于地面',
        underground: '位于地底(希芙拉河等)',
        dlcShadowOfTheErdtree: '位于DLC',
        selector: '选择类型',
        namePlaceHolder: '名称',
        descPlaceHolder: '描述',
        reposition: '重新选择位置',
        btn1: '添加',
        btn1EditMode: '修改',
        btn1Uploading: '上传中',
        btn2: '取消',
        editModeTitle: '修改 {title}',
        addTip1: '添加前请仔细确认是否已经有人添加过了,没有找到可能是因为筛选没有选择()',
        addTip2: '若要补充信息请编辑原有地标的说明，不要另外添加同名地标~',
        surfaceItem: '在地表',
        cave: '在洞穴',
        afterBurning: '在灰城',
      },
      info: {
        like: '给予好评',
        dislike: '给予恶评',
        edit: '编辑',
        delete: '删除',
        collect: '收藏',
        uncollect: '取消收藏',
        hide: '隐藏',
        unhide: '取消隐藏',
        lock: '锁定',
        btn1: '关闭',
        reply: '补充',
        replyLoading: '加载中...',
      },
      delete: {
        btn1: '确认删除',
        btn2: '取消',
      },
      mapSwitcher: {
        title: '切换地图',
        surface: '地面地图',
        underground: '地底地图',
        dlcShadowOfTheErdtree: 'DLC「黄金树幽影」地图（临时）',
      },
    },
    alert: {
      exceeded: '名字(≤20)/描述(≤1000)太长了~',
      empty: '请填写名字/选择类型再提交~',
      repeat: '已经有了同名的地标了，请点"取消"返回去检查一下捏，记得左边筛选栏打开全选（）\r\n※ 如果要补充信息请编辑原有地标的说明 \r\n※ 如果是这里判断错了，请点"确定"继续添加',
      maperror: 'Oops! 从服务器获取数据失败力(っ °Д °;)っ \r\n 如果刷新一下还不行的话恐怕是程序bug, 去讯息反馈一下吧（加群也行（群号在讯息置顶',
      uploading: '正在发送到服务器喵，一直发送(20s以上)停不下来的话大概是服务器/浏览器卡了，刷新一下试试',
    },
  },
  apothegm: {
    header: {
      placeholder: '搜索讯息',
      search: '搜索',
      result: '清除结果',
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
    alert: {
      titleExceeded: '标题(≤20)/内容(≤1000)太长了~',
      titleEmpty: '请填写标题/类型再提交~',
      contentExceeded: '内容(≤1000)太长了~',
      contentEmpty: '请填写内容再提交~',
    },
  },
  general: {
    title: '设置之类的',
    menulang: '菜单语言',
    maplang: '地图语言转换',
    dontConvert: '不转换',
    theresNoHiddenPointByNow: '目前没有隐藏点捏，点开地标后在下面可以隐藏这个地标，筛选栏里可以切换是否显示~',
    therereSomeHiddenPoints: '目前有{count}个隐藏点，确定要清除隐藏状态，全部重置吗?',
    hiddenPointYattaze: '重置了',
    clearHiddenPointButton: '重置所有隐藏点',
    developing: '后续功能开发中',
    localData: {
      title: '本地数据管理',
      import: '导入',
      export: '导出',
      tooltip: '当前导入/导出功能只读取/保存收藏点与隐藏点的id',
      importing: '正在导入...',
      importError: '导入错误',
      exportError: '导出错误',
      importInfo: '从 {files} 个文件中导入了 {collections} 个收藏点，{hiddens} 个隐藏点',
    },
    april: {
      title: '重要通知',
      content:
        '本站的日浏览量竟然、竟然连续一年保持在了2000以上——(≧▽≦)ノﾊﾟﾁﾊﾟﾁ! 作为对大家使用的感谢，咱将送给每位访问者一只可爱的猫娘，点击下面按钮填写信息後将在接下来一周内陆续發放喵，今后也恳请大家多多支持喵——',
      button: '查看详情',
      footer: '-wniko- 2022 年 4 月 1 日',
    },
  },
  about: {
    lastUpdate: '最近更新',
    coffee: '给服务器续命☕',
    feedback: '漏洞・意见反馈',
    update: '更新内容',
    github: 'GitHub页',
    statistics: {
      title: '统计喵',
      days: '已经为褪色者们服务了',
      daysData: '{days} 天',
      markers: '地标总计',
      markersData: '{count} 个',
      markersWithoutDeleted: '地标总计(不计入已删除地标)',
      markersWithoutDeletedData: '{count} 个',

      weeklyUpdate: '访问情况',

      view: '访问量总计',
      viewData: '{count} 次',
      ip: '访问IP总计',
      ipData: '{count} 个',
      dayView: '日均访问量(统计7天)',
      dayViewData: '{count} 次',
      dayIp: '日均访问IP(统计7天)',
      dayIpData: '{count} 个',

      mostOrigin: '最大来源URL',
      mostRegion: '最大来源地区',

      mostSearched: '搜索词排行(前10)',

      types: '各个类型统计',
      testMarker: '早期测试用例',

      end: '到此为止了喔!',
      serverError: '服务器连接失败了喵',
    },
    modals: {
      coffee: {
        text: '觉得好用的话，可以在这里续命一下服务器 (一杯奶茶钱就行..(小声) 咱的生活费已经要撑不下去了（悲',
        or: '或者...',
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
      selectAll: '全选/全不选',
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
      wind: '灵魂气流',
      cave: '洞窟',
      cemetery: '地下墓穴',
      sword: '封印监牢',
      temple: '灵庙',
      place: '地点',
      arena: '竞技场',
      bigboss: '半神BOSS',
      boss: 'BOSS(成就)',
      littleboss: '小BOSS',
      redsoul: '红灵入侵',
      jingyingguai: '精英怪',
      stone: '锻造石',
      orchid: '墓地铃兰',
      goldenseed: '黄金种子',
      ludi: '露滴',
      shengbeiludi: '圣杯露滴',
      bead: '铃珠',
      key: '石剑钥匙',
      sigen: '死根',
      item: '一般道具',
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
      importantitem: '重要道具',
      metarial: '材料',
      ring: '戒指护符',
      tear: '泪滴幼体',
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
export default lang;
export type langType = typeof lang;
