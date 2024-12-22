const lang = {
  name: '日本語',
  title: 'エルリンマップ EldenRing Map',
  menu: {
    map: 'マップ',
    apo: 'メッセージ',
    routes: 'サイド(pre)',
    general: '設定',
    about: '説明',
    tdmap: '3Dマップ（開発中）',
    collect: '保存済',
  },
  map: {
    loading: {
      loading: '読み込み中',
      renderring: 'レンダリング中',
    },
    topright: {
      search: '検索',
      add: '目印追加',
      placeholder: '目印検索',
      result: '{result}件の結果があります。クリックして結果をクリア',
      editModeHint: 'マップ上でクリックして目印を追加',
      editModeBtn: '編集を終了',
      changePositionModeHint: 'マップ上で新しい位置を選択',
    },
    left: {
      buttonBeforeOpen: 'フ<br />ィ<br />ル<br />タ',
      buttonAfterOpen: '折<br />り<br />畳<br />む',
      mapSwitcher: '地表/地下/DLCマップ切り替え',
      undergroundSwitcher1: '地下マップに切り替え',
      undergroundSwitcher2: '地表マップに切り替え',
      surface: '地表',
      cave: 'ﾄﾞﾝｼﾞｮﾝ',
      afterBurning: '灰都',
      tips: '目印をクリックし詳細を | 目印を右クリック・長押で非表示/保存 | 編集で目印を移動可能 | 設定で言語切り替え可能 | バグがあればメッセージで報告をお願いします | 「悪評を非表示」で低評価の目印を隠すことが可能',
      showNameButton: '地名を表示',
      fontSizeLabel: '文字サイズ',
      fontSizeSmall: '小',
      fontSizeMedium: '中',
      fontSizeLarge: '大',
      logout: 'ログアウト',
      registerTip: 'ﾛｸﾞｲﾝで保存済同期',
    },
    bottom: {
      developerAndProvider: 'dev by ',
      donate: '鯖を支援',
    },
    modals: {
      add: {
        title: '目印追加',
        surface: '地表にある',
        underground: '地下（ｼｰﾌﾗ河など）にある',
        dlcShadowOfTheErdtree: 'DLCにある',
        selector: 'タイプ選択',
        namePlaceHolder: '名前',
        descPlaceHolder: '説明',
        reposition: '位置を再選択',
        btn1: '追加',
        btn1EditMode: '変更',
        btn1Uploading: 'アップロード中',
        btn2: 'キャンセル',
        editModeTitle: '{title}を編集',
        addTip1: '追加前に既に追加されていないか確認してください。見つからない場合、フィルターの設定が原因かもしれません。',
        addTip2: '情報を補足する場合、既存の目印説明を編集し、新しい同名の目印を追加しないでください。',
        surfaceItem: '地表にある',
        cave: 'ドンジョンにある',
        afterBurning: '灰都にある',
      },
      info: {
        like: '高評価',
        dislike: '低評価',
        edit: '編集',
        delete: '削除',
        collect: '保存済',
        uncollect: '保存解除',
        hide: '非表示',
        unhide: '非表示解除',
        lock: 'ロック',
        btn1: '閉じる',
        reply: '補足',
        replyLoading: '読み込み中...',
      },
      delete: {
        btn1: '削除',
        btn2: 'キャンセル',
      },
      mapSwitcher: {
        title: 'マップを切り替え',
        surface: '地表マップ',
        underground: '地下マップ',
        dlcShadowOfTheErdtree: 'DLCマップ',
      },
      register: {
        title: 'アカ作成',
        username: 'ユーザーID（英数字のみ）',
        password: 'パスワード',
        password2: 'パスワードを再入力',
        exist: 'このユーザーIDは既に存在します。別のIDにしてください。',
        not_recaptcha: '下記で人間であることを確認してください。',
        password_not_the_same: '入力されたパスワードが一致しません。',
        unknown_error: 'サーバーで不明なエラーが発生しました。',
        username_too_long: 'ユーザーIDは20文字以内にしてください。',
        tips: 'アカウントを作成すると、複数デバイス間でお気に入りと非表示を同期し、自分が追加した目印を管理したり編集できます。',
        email: 'メールアドレス',
        verification_code: 'メール確認コード',
        send_verification_code: '確認コードを送信',
        wait_for_one_minute: '{seconds}秒待ってください。',
        email_blank: 'メールアドレスが入力されていません。',
        username_blank: 'ユーザー名を入力してください。',
        password_blank: 'パスワードが入力されていません。',
        username_wrong: 'ユーザーIDは英数字2〜20文字で入力してください。',
        password_wrong: 'パスワードは英数字2〜20文字で入力してください。',
        verification_code_blank: '確認コードが入力されていません。',
        verification_code_error: '確認コードが正しくありません。',
        verification_code_send: '送信しました。受信できない場合は迷惑メールを確認してください。',
        verification_code_send_fail: 'メールの送信に失敗しました。メールアドレスに問題がないか確認してください。',
      },
      login: {
        title: 'ログイン',
        email: 'メールアドレス',
        username: 'ID',
        password: 'パスワード',
        remember: 'このデバイスでログイン状態を保持',
        error: 'メールアドレス/ユーザーIDまたはパスワードが間違っています。',
      },
    },
    alert: {
      exceeded: '名前（≤20）/説明（≤1000）が長すぎます。',
      empty: '名前を入力し、タイプを選択してから送信してください。',
      repeat:
        '同名の目印が既に存在します。「キャンセル」をクリックして確認し、左のフィルターメニューで全選択をオンにしてください。\r\n※ 情報を補足する場合、既存の目印説明を編集してください。\r\n※ 誤判定の場合、「確定」をクリックして追加を続行してください。',
      maperror:
        'おっと！ サーバーからデータの取得に失敗しました（っ °Д °;)っ \r\n リフレッシュしても解決しない場合、プログラムのバグかもしれません。メッセージで報告してください（グループに参加するのも可）。',
      uploading: 'サーバーに送信中です。20秒以上経っても終了しない場合、サーバーまたはブラウザが遅延している可能性があります。リフレッシュしてみてください。',
    },
  },
  apothegm: {
    header: {
      placeholder: 'メッセージを検索',
      search: '検索',
      result: '結果をクリア',
      write: 'メッセージを書く',
      my: '自分のメッセージ',
    },
    list: {
      replies: '返信',
      like: '高評価',
      dislike: '低評価',
    },
    reply: {
      return: '戻る',
      delete: '削除',
      share: '共有',
      reply: '返信',
    },
    modals: {
      add: {
        title: 'メッセージを書く',
        selector: 'タイプを選択',
        titlePlaceHolder: 'タイトル',
        contentPlaceHolder: '内容',
        btn1: 'メッセージを書く',
        btn2: '指を引っ込める',
      },
      reply: {
        title: 'メッセージへの返信を書く',
        contentPlaceHolder: '内容',
        btn1: '返信',
        btn2: '指を引っ込める',
      },
      share: {
        title: '長押しでコピーしてください',
        btn1: '戻る',
      },
    },
    alert: {
      titleExceeded: 'タイトル（≤50）/内容（≤1000）が長すぎます。',
      titleEmpty: 'タイトルを入力し、タイプを選択してから送信してください。',
      contentExceeded: '内容（≤1000）が長すぎます。',
      contentEmpty: '内容を入力してから送信してください。',
    },
  },
  general: {
    title: '設定など',
    menulang: 'メニュー言語',
    maplang: 'マップ言語変換',
    dontConvert: '変換しない',
    theresNoHiddenPointByNow: '現在非表示目印はありません。目印を開いて下部で非表示設定が可能です。フィルターメニューで表示/非表示を切り替えられます。',
    therereSomeHiddenPoints: '現在{count}件の非表示目印があります。非表示状態をクリアして全てリセットしますか？',
    hiddenPointYattaze: 'リセットしました。',
    clearHiddenPointButton: '全ての非表示目印をリセット',
    developing: '今後の機能開発中',
    localData: {
      title: 'ローカルデータ管理',
      import: 'インポート',
      export: 'エクスポート',
      tooltip: '現在インポート/エクスポート機能では保存済目印と非表示目印のIDのみを読み取り/保存します。',
      importing: 'インポート中...',
      importError: 'インポートエラー',
      exportError: 'エクスポートエラー',
      importInfo: '{files}個のファイルから{collections}件の保存済目印、{hiddens}件の非表示目印をインポートしました。',
    },
    april: {
      title: '重要なお知らせ',
      content:
        'このサイトの日間閲覧数がなんと、なんと1年間連続して2000を超えました――(≧▽≦)ノﾊﾟﾁﾊﾟﾁ! 利用してくださる皆さんへの感謝の気持ちとして、訪問者の皆さんに可愛い猫娘をプレゼントします。以下のボタンをクリックして情報を入力していただくと、今後1週間以内に順次配布されます。今後とも応援よろしくお願いします。',
      button: '詳細を見る',
      footer: '-wniko- 2022年4月1日',
    },
  },
  about: {
    lastUpdate: '最新更新',
    coffee: 'サーバーを支援する☕',
    feedback: 'バグ・意見フィードバック',
    update: '更新内容',
    github: 'GitHubページ',
    statistics: {
      title: '統計情報',
      days: '褪せ人たちにサービスを提供してからの期間',
      daysData: '{days}日',
      markers: '目印総数',
      markersData: '{count}件',
      markersWithoutDeleted: '目印総数（削除済みを除く）',
      markersWithoutDeletedData: '{count}件',

      weeklyUpdate: 'アクセス状況',

      view: '総アクセス数',
      viewData: '{count}回',
      ip: '総アクセスIP数',
      ipData: '{count}件',
      dayView: '日平均アクセス数（7日間の統計）',
      dayViewData: '{count}回',
      dayIp: '日平均アクセスIP数（7日間の統計）',
      dayIpData: '{count}件',

      mostOrigin: '最大出典URL',
      mostRegion: '最大出典地域',

      mostSearched: '検索ワードランキング（トップ10）',

      types: '各タイプ統計',
      testMarker: '初期テストケース',

      end: '以上です！',
      serverError: 'サーバー接続に失敗しました。',
    },
    modals: {
      coffee: {
        text: '使いやすいと感じたら、ここでサーバーを支援してください（お茶一杯分の金額で十分です..（小声） 私の生活費がもう持ちません（悲）',
        or: 'または...',
        btn1: 'OK',
      },
    },
  },
  siteTypes: {
    functionalFilters: {
      myPoints: '自分追加点',
      myCollect: '保存済ON',
      showHidden: '非表示ON',
      hideBad: '低評価ON',
      selectAll: '全選択/全解除',
      hideBadTip: '注意：この操作は祝福以外のすべての低評価が高評価を超える目印を非表示にします。一部正しい目印も含まれる可能性があります！',
    },
    filterGroupNames: {
      sites: '場所',
      enemy: '敵',
      items: 'アイテム',
      collection: '収集',
      weapons: '武器',
      message: 'メッセージ',
      dlc1items: 'DLC1アイテム',
    },
    filters: {
      cifu: '祝福',
      jiejing: '近道',
      portal: '転送門',
      soulsite: 'ルーン稼ぎ所',
      shop: 'ショップ',
      npc: 'NPC',
      map: '地図断片',
      lianji: 'サイン溜まり',
      wind: '霊気流',
      cave: 'ドンジョン',
      cemetery: '地下墓地',
      sword: '封印監獄',
      temple: '霊廟',
      place: '場所',
      arena: '闘技場',
      bigboss: 'ﾃﾞﾐｺﾞｯﾄﾞBOSS',
      boss: 'BOSS(実績)',
      littleboss: '小BOSS',
      redsoul: '赤霊侵入',
      jingyingguai: 'ｴﾘｰﾄﾓﾝｽﾀｰ',
      stone: '鍛石',
      orchid: '墓地鈴蘭',
      goldenseed: '黄金の種子',
      ludi: '雫',
      shengbeiludi: '聖杯の雫',
      bead: '鈴珠',
      key: '石剣の鍵',
      sigen: '死の根',
      item: '一般アイテム',
      gesture: 'ジェスチャ',
      paint: '絵画',
      magic: '魔法',
      daogao: '祈祷',
      weapon: '武器',
      clothes: '装備',
      zhanhui: '戦灰',
      guhui: '遺灰',
      text: '説明',
      warn: '警告',
      question: '質問',
      taoke: 'スキップ',
      importantitem: '重要アイテム',
      metarial: '素材',
      ring: '指輪・護符',
      tear: '雫の幼体',
      scadutreefragment: '影樹の破片',
      spiritashes: '霊灰',
    },
  },
  apoTypes: {
    functionalFilters: {
      all: 'すべて',
      my: '自分の',
    },
    filterGroupNames: {
      website: 'サイト関連',
      game: 'ゲーム関連',
      others: 'その他',
    },
    filters: {
      update: '更新',
      suggest: '提案',
      bug: 'バグ報告',
      strategy: '攻略',
      kokoroe: '心得',
      ask: '質問',
      message: 'メッセージ',
      water: '雑スレ',
    },
  },
  collect: {
    table: {
      type: 'タイプ',
      name: '名前',
      savePlace: '保存位置',
      delete: '削除',
      locate: '位置を特定',
      local: 'ローカル',
      server: 'クラウド',
      saveToServer: 'すべての保存済をクラウドにアップロード',
    },
  },
};

export default lang;
export type langType = typeof lang;