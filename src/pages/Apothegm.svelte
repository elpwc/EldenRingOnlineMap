<script lang="ts">
  /**
   * 讯息页
   */
  import { onMount } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import { ip, isAdminModeStore } from '../stores';
  import { fly } from 'svelte/transition';
  import axios from 'axios';
  import type { Apothegm } from '../utils/typings';
  import { ApothegmType } from '../utils/enum';

  import { t } from 'svelte-i18n';
  import { getApoFilters } from '../utils/filters';

  import Edit from '../assets/icons/icon-edit.svg';
  import SendMyself from '../assets/icons/icon-send-myself.svg';
  import Pin from '../assets/icons/icon-pin.svg';
  import Search from '../assets/icons/icon-search.svg';
  import Left from '../assets/icons/icon-left-arrow.svg';
  import Comment from '../assets/icons/icon-comment.svg';
  import { getMD5Id } from '../utils/utils';

  let apo_filters = getApoFilters($t);

  // 路径参数: 讯息id
  // 仅用来从外部直接打开讯息，从网页内部打开讯息不使用这个
  export let params = { id: null };
  onMount(() => {
    // 加载讯息
    refreshApo();
  });

  /** 发送讯息Modal */
  let postModalVisibility: boolean = false;
  /** 回复Modal */
  let replyModalVisibility: boolean = false;
  /** 分享链接Modal */
  let copyModalVisibility: boolean = false;
  /** 删除讯息确认框 */
  let deleteConfirmVisibility: boolean = false;
  /** 选择地标类型Modal */
  let selectTypeVisability: boolean = false;

  /** 搜索框内容 */
  let searchWord: string = '';

  /** 删的是讯息的回复还是讯息 apo: true, reply: false */
  let deleteReply: boolean = false;

  /** 当前打开的讯息id */
  let currentShowingApoId: number = 0;
  /** 当前打开的讯息index */
  let currentShowingApoIndex: number = -1;

  /** 当前打开的讯息回复id */
  let currentClickedReplyId: number = 0;
  /** 当前打开的讯息回复index */
  let currentClickedReplyIndex: number = -1;

  /** 要发送的讯息标题 */
  let postTitle: string = '';
  /** 要发送的讯息内容 */
  let postContent: string = '';
  /** 要发送的讯息的姿态（未使用 */
  let postGesture: string = '';
  /** 要加的点的类型 */
  let postType: ApothegmType = ApothegmType.Empty;

  /** 是否显示自己发的讯息 */
  let showSelf: boolean = false;
  /** 要发送的回复内容 */
  let replyContent: string = '';

  /** 是否处于搜索结果展示模式 */
  let isSearch: boolean = false;

  /** 当前拉取的所有讯息 */
  let apothegms: Apothegm[] = [];

  /**
   * 更新currentShowingApoIndex
   */
  const refreshCurrentShowingApoIndex = () => {
    let res = -1;
    for (let i = 0; i < apothegms.length; i++) {
      if (apothegms[i].id === currentShowingApoId) {
        res = i;
        break;
      }
    }
    currentShowingApoIndex = res;
  };

  // 根据url参数跳转到讯息
  if (params?.id) {
    currentShowingApoId = params?.id;
    refreshCurrentShowingApoIndex();
  }

  /**
   * 根据kword / ip拉取讯息
   * @param id 指定拉取的id，不输入为拉取符合条件的所有
   */
  const refreshApo = (id: number = 0) => {
    if (id > 0) {
      // 拉取指定id
      axios
        .get('./apothegm.php', {
          params: { id },
        })
        .then(res => {
          console.log(res.data);
          // 更新apothegms中的拉取到的那个
          apothegms[
            apothegms.findIndex(f => {
              return f.id === id;
            })
          ] = (res.data as Apothegm[])?.[0];
        });
    } else {
      // 拉取全部
      axios
        .get('./apothegm.php', {
          params: {
            kword: isSearch ? searchWord : '',
            ip: showSelf ? ip : '',
          },
        })
        .then(res => {
          console.log(res.data);

          const tmpApo = res.data as Apothegm[];
          // 先判断有没有置顶的，没有的话不操作，更快一些
          if (
            tmpApo.filter(f => {
              return f.is_top === true;
            }).length > 0
          ) {
            // 有置顶的
            // 把置顶的拉到前面
            apothegms = tmpApo
              .filter(f => {
                return f.is_top === true;
              })
              ?.concat(
                tmpApo.filter(f => {
                  return f.is_top === false;
                })
              );
          } else {
            // 没有置顶的
            apothegms = tmpApo;
          }
        });
    }
  };

  /** 搜索 */
  const onSearch = () => {
    if (searchWord !== '') {
      isSearch = true;

      // 提交搜索内容，用来日后分析
      axios.post('./searchUpload.php', {
        content: searchWord,
        ip,
        position: 'apothegm',
      });

      refreshApo();
    }
  };

  /** 发布讯息 */
  const onPost = () => {
    if (postTitle !== '' || postType !== ApothegmType.Empty) {
      if (postTitle.length <= 50 && postContent.length <= 1000) {
        axios
          .post('./apothegm.php', {
            title: postTitle,
            content: postContent,
            like: 0,
            dislike: 0,
            type: postType,
            ip,
          })
          .then(res => {
            console.log(res);
            postModalVisibility = false;
            postContent = '';
            postTitle = '';
            postType = ApothegmType.Empty;

            refreshApo(/*res.data?.id*/);
          });
      } else {
        alert($t('apothegm.alert.titleExceeded'));
      }
    } else {
      alert($t('apothegm.alert.titleEmpty'));
    }
  };

  /** 分享 */
  const onShare = () => {
    copyModalVisibility = true;
  };

  /** 回复 */
  const onReply = () => {
    if (replyContent !== '') {
      if (replyContent.length <= 1000) {
        axios
          .post('./reply.php', {
            pid: currentShowingApoId,
            content: replyContent,
            like: 0,
            dislike: 0,
            ip,
          })
          .then(res => {
            console.log(res);
            replyModalVisibility = false;
            replyContent = '';

            // 更新讯息的最新回复日期
            axios
              .patch('./apothegm.php', {
                id: currentShowingApoId,
                reply_date: Date.now() / 1000, // PHP时间戳少3位（缺少毫秒位
              })
              .then(res2 => {
                console.log(res2);
                refreshApo(currentShowingApoId);
              });
          });
      } else {
        alert($t('apothegm.alert.contentExceeded'));
      }
    } else {
      alert($t('apothegm.alert.contentEmpty'));
    }
  };

  /** 对讯息好评 */
  const onLikeApo = () => {
    axios
      .patch('./apothegm.php', {
        id: currentShowingApoId,
        like: 0,
      })
      .then(res => {
        refreshApo(currentShowingApoId);
      });
  };

  /** 对讯息恶评 */
  const onDislikeApo = () => {
    axios
      .patch('./apothegm.php', {
        id: currentShowingApoId,
        dislike: 0,
      })
      .then(res => {
        refreshApo(currentShowingApoId);
      });
  };

  /** 对回复好评 */
  const onLikeReply = () => {
    axios
      .patch('./reply.php', {
        id: currentClickedReplyId,
        like: 0,
      })
      .then(res => {
        refreshApo(currentShowingApoId);
      });
  };

  /** 对回复恶评 */
  const onDislikeReply = () => {
    axios
      .patch('./reply.php', {
        id: currentClickedReplyId,
        dislike: 0,
      })
      .then(res => {
        refreshApo(currentShowingApoId);
      });
  };

  /** 删除讯息 */
  const onDeleteApo = () => {
    axios
      .delete('./apothegm.php', {
        data: {
          id: currentShowingApoId,
        },
      })
      .then(res => {
        apothegms = apothegms.filter(f => {
          return f.id !== currentShowingApoId;
        });
        currentShowingApoId = 0;
        currentShowingApoIndex = -1;
      });
  };

  /** 删除回复 */
  const onDeleteReply = () => {
    axios
      .delete('./reply.php', {
        data: {
          id: currentClickedReplyId,
        },
      })
      .then(res => {
        apothegms[currentShowingApoIndex].replies = apothegms[currentShowingApoIndex].replies.filter(f => {
          return f.id !== currentClickedReplyId;
        });
        currentClickedReplyId = 0;
        currentClickedReplyIndex = -1;
      });
  };

  /** 添加地标的选择类型的Modal里的各个类型按钮的事件喵 */
  const onFilterModalClick = (value: string) => {
    postType = value as ApothegmType;
    selectTypeVisability = false;
  };
</script>

<div class="container">
  <!--搜索 添加栏-->
  <header id="inputDiv">
    <div style="display: flex;">
      <div id="searchTextContainer">
        <input type="text" style="border: none; width: 80%; box-shadow: none;" placeholder={$t('apothegm.header.placeholder')} bind:value={searchWord} />
        {#if isSearch}
          <button
            style="border: none; font-size: 0.6em; box-shadow: none;"
            on:click={() => {
              isSearch = false;
              searchWord = '';
              refreshApo();
            }}
          >
            {$t('apothegm.header.result')}
          </button>
        {/if}
      </div>
      <button on:click={onSearch}>
        <Search />
        {$t('apothegm.header.search')}</button
      >
    </div>
    <button
      style="border: none; box-shadow: none;"
      on:click={() => {
        postModalVisibility = true;
      }}
    >
      <Edit />
      {$t('apothegm.header.write')}
    </button>
    <button
      style="border: none; box-shadow: none;"
      on:click={() => {
        showSelf = !showSelf;
        refreshApo();
      }}
      class={showSelf ? 'selfactive' : ''}
    >
      <SendMyself />
      {$t('apothegm.header.my')}
    </button>
  </header>

  <!--讯息列表-->
  <main id="listDiv">
    {#if apothegms?.length > 0}
      {#each apothegms as apo (apo.id)}
        <div
          class="apothegm"
          on:click={() => {
            // 点击讯息打开
            currentShowingApoId = apo?.id;
            refreshCurrentShowingApoIndex();
          }}
        >
          <div class="title">
            <div class="title-reply">
              <span class="titlespan">
                {#if apo.is_top}
                  <Pin />
                {/if}

                {#if apo_filters.filter(f => {
                  return f.value === apo?.type;
                })?.[0]?.show}
                  <span
                    style="color: {apo_filters.filter(f => {
                      return f.value === apo?.type;
                    })?.[0]?.color};"
                  >
                    [{apo_filters.filter(f => {
                      return f.value === apo?.type;
                    })?.[0].name}]
                  </span>
                {/if}

                {@html apo?.title}
              </span>
            </div>
          </div>
          <!--<p>默认把\n处理为空格，所以需要转义为<br />-->
          <p class="contentp">{@html apo?.content?.replaceAll('\n', '<br />')}</p>

          <div class="title-reply" style="justify-content: space-between; ">
            <span class="replyspan">{$t('apothegm.list.replies')} {apo?.replies?.length}</span>
            <span class="datespan">{apo?.reply_date}</span>
            <span class="likespan">{$t('apothegm.list.like')} {apo?.like} {$t('apothegm.list.dislike')} {apo?.dislike}</span>
          </div>
        </div>
      {/each}
    {/if}
  </main>

  <!--讯息详情-->
  {#if currentShowingApoId > 0}
    <div id="apothegmContent" transition:fly={{ x: window.innerWidth, duration: 300 }}>
      <div class="apothegmContentHeadertitlebar">
        <div>
          <button
            on:click={() => {
              currentShowingApoId = 0;
              currentShowingApoIndex = -1;
            }}
          >
            <Left />
            {$t('apothegm.reply.return')}
          </button>
        </div>
        <div>
          {#if $isAdminModeStore || apothegms?.[currentShowingApoIndex]?.ip === ip}
            <button
              on:click={() => {
                // 设置删除的是讯息还是回复
                deleteReply = false;
                deleteConfirmVisibility = true;
              }}
            >
              {$t('apothegm.reply.delete')}
            </button>
          {/if}
          <button on:click={onShare}>
            {$t('apothegm.reply.share')}
          </button>
          <button
            on:click={() => {
              replyModalVisibility = true;
            }}
          >
            <Comment />
            {$t('apothegm.reply.reply')}
          </button>
        </div>
      </div>

      <header id="apothegmContentHeader">
        <div>
          <p style="font-size: 1.2em; font-weight: bold; ">{@html apothegms?.[currentShowingApoIndex]?.title}</p>

          <p>{@html apothegms?.[currentShowingApoIndex]?.content?.replaceAll('\n', '<br />')}</p>
          <div class="title">
            <div class="title-reply">
              <span class="titlespan">{getMD5Id(apothegms?.[currentShowingApoIndex]?.ip)}</span><span class="replyspan"
                >{$t('apothegm.list.replies')} {apothegms?.[currentShowingApoIndex]?.replies?.length}</span
              >
            </div>
            <span class="datespan">{apothegms?.[currentShowingApoIndex]?.create_date}</span>
            <div>
              <button on:click={onLikeApo}>{$t('apothegm.list.like')} {apothegms?.[currentShowingApoIndex]?.like}</button>
              <button on:click={onDislikeApo}>{$t('apothegm.list.dislike')} {apothegms?.[currentShowingApoIndex]?.dislike}</button>
            </div>
          </div>
        </div>
      </header>

      <!--回复列表-->
      <main>
        {#if apothegms?.[currentShowingApoIndex]?.replies?.length > 0}
          {#each apothegms?.[currentShowingApoIndex]?.replies as reply, index (reply.id)}
            <div class="apothegm">
              <div class="title">
                <div class="title-reply"><span class="titlespan">{'#' + String(index + 1) + ' ' + getMD5Id(reply?.ip)}</span></div>
                <div class="title-reply">
                  <span class="datespan">{reply?.create_date}</span>
                  {#if $isAdminModeStore || reply?.ip === ip}
                    <button
                      on:click={() => {
                        currentClickedReplyId = reply.id;
                        currentClickedReplyIndex = index;

                        // 设置删除的是讯息还是回复
                        deleteReply = true;
                        deleteConfirmVisibility = true;
                      }}
                    >
                      {$t('apothegm.reply.delete')}
                    </button>
                  {/if}
                  <span class="likespan">
                    <button
                      on:click={() => {
                        currentClickedReplyId = reply?.id;
                        currentClickedReplyIndex = index;
                        onLikeReply();
                      }}>{$t('apothegm.list.like')} {reply?.like}</button
                    >
                    <button
                      on:click={() => {
                        currentClickedReplyId = reply?.id;
                        currentClickedReplyIndex = index;
                        onDislikeReply();
                      }}>{$t('apothegm.list.dislike')} {reply?.dislike}</button
                    >
                  </span>
                </div>
              </div>
              <p class="contentp-reply">{@html reply?.content?.replaceAll('\n', '<br />')}</p>
            </div>
          {/each}
        {/if}
      </main>
    </div>
  {/if}
  <!--讯息详情结束-->
</div>

<!--发送讯息Modal-->
<Modal
  visible={postModalVisibility}
  zindex={114514}
  width="70%"
  title={$t('apothegm.modals.add.title')}
  showOkButton
  showCloseButton
  okButtonText={$t('apothegm.modals.add.btn1')}
  closeButtonText={$t('apothegm.modals.add.btn2')}
  onOKButtonClick={onPost}
  onCloseButtonClick={() => {
    postModalVisibility = false;
    postContent = '';
    postTitle = '';
    postType = ApothegmType.Empty;
  }}
>
  <div class="modalInner">
    <button
      on:click={() => {
        selectTypeVisability = true;
      }}
    >
      {apo_filters.filter(type => {
        return type.value === postType;
      })?.[0]?.name || `——${$t('apothegm.modals.add.selector')}——`}
    </button>
    <input type="text" placeholder="{$t('apothegm.modals.add.titlePlaceHolder')} (1～20)" bind:value={postTitle} />
    <textarea placeholder="{$t('apothegm.modals.add.contentPlaceHolder')} (0～1000)" bind:value={postContent} />
  </div>
</Modal>

<!--回应讯息Modal-->
<Modal
  visible={replyModalVisibility}
  zindex={114514}
  width="70%"
  title={$t('apothegm.modals.reply.title')}
  showOkButton
  showCloseButton
  okButtonText={$t('apothegm.modals.reply.btn1')}
  closeButtonText={$t('apothegm.modals.reply.btn2')}
  onOKButtonClick={onReply}
  onCloseButtonClick={() => {
    replyModalVisibility = false;
    replyContent = '';
  }}
>
  <div class="modalInner">
    <textarea placeholder="{$t('apothegm.modals.reply.contentPlaceHolder')} (0～1000)" bind:value={replyContent} />
  </div>
</Modal>

<!--分享复制讯息Modal-->
<Modal
  zindex={114514}
  visible={copyModalVisibility}
  title={$t('apothegm.modals.share.title')}
  showOkButton
  okButtonText={$t('apothegm.modals.share.btn1')}
  onOKButtonClick={() => {
    copyModalVisibility = false;
  }}
>
  <div class="modalInner">
    <p style="overflow-wrap: anywhere;">
      {apothegms?.[currentShowingApoIndex]?.title + `\r\nhttps://www.elpwc.com/eldenringmap/#/apothegm/${currentClickedReplyId}`}
    </p>
  </div>
</Modal>

<!--删除讯息或回复Modal-->
<Modal
  visible={deleteConfirmVisibility}
  top="30%"
  zindex={114700}
  showOkButton
  showCloseButton
  okButtonText={$t('map.modals.delete.btn1')}
  closeButtonText={$t('map.modals.delete.btn2')}
  onOKButtonClick={() => {
    // 判断删除的是讯息还是回复
    if (deleteReply) {
      onDeleteReply();
    } else {
      onDeleteApo();
    }
    deleteConfirmVisibility = false;
  }}
  onCloseButtonClick={() => {
    deleteConfirmVisibility = false;
  }}
/>

<!--添加/编辑Modal里的选择类型Modal-->
<Modal visible={selectTypeVisability} top="5%" title={$t('apothegm.modals.add.selector')} zindex={1919810} width="{window.innerWidth * 0.8}px " backgroundOpacity={0.8}>
  <div id="selectModalInner">
    {#each apo_filters as filter}
      {#if filter?.hr}
        <p class="filterHrInModal"><span>——————</span><span>{filter.name}</span><span>——————</span></p>
      {:else if !filter?.functional}
        <button
          class="filterButtonInModal"
          on:click={() => {
            onFilterModalClick(filter.value);
          }}>{filter.name}</button
        >
      {/if}
    {/each}
  </div>
</Modal>

<style>
  .modalInner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 40px;
  }
  .filterHrInModal {
    align-self: center;
    color: #f5cc95;
    width: -webkit-fill-available;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 5px;
  }
  .filterButtonInModal {
    font-size: 1em;
    padding: 5px 10px;
  }
  #selectModalInner {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .modalInner input {
    font-size: 1.1em;
    padding: 5px 0;
  }
  .modalInner textarea {
  }
  textarea {
    height: 100px;
  }
  .modalInner p {
    color: rgb(208, 200, 181);
  }
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 1.3em;
  }
  .title-reply {
    display: flex;
    gap: 5px;
  }
  .titlespan {
    font-size: 0.8em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .replyspan {
    font-size: 0.7em;
    color: rgb(126, 118, 99);
  }
  .likespan {
    font-size: 0.7em;
  }
  .datespan {
    font-size: 0.7em;
  }
  .contentp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin: 5px 0;
  }
  .contentp-reply {
    margin: 5px 0;
  }
  .apothegm {
    border-bottom: solid 1px rgb(204, 178, 118);
    margin: 0px 10px;
    padding: 5px;
    cursor: pointer;
  }
  @media (any-hover: hover) {
    .apothegm:hover {
      background-color: rgb(38, 39, 33);
    }
  }
  .apothegm:active {
    background-color: rgb(45, 46, 40);
  }
  .selfactive {
    border: solid 1px rgb(204, 178, 118) !important;
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: rgb(21, 22, 17);
    color: rgb(208, 200, 181);
  }
  #inputDiv {
    height: 35px;
    background-color: rgb(21, 22, 17);
    border-bottom: solid 1px rgb(204, 178, 118);
    display: flex;
    padding: 10px;
    box-shadow: 0 0 5px 0 rgb(204, 178, 118);
    gap: 10px;
  }
  #apothegmContentHeader {
    width: auto;
    height: fit-content;
    background-color: rgb(21, 22, 17);
    border-bottom: solid 2px rgb(204, 178, 118);
    padding: 10px;
    box-shadow: 0 0 5px 0 rgb(204, 178, 118);
    top: 60px;
  }
  #apothegmContent {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
    overflow-y: scroll;
    background-color: rgba(30, 30, 30, 0.9);
  }
  #apothegmContent main {
    background-color: rgb(21, 22, 17, 0.9);
    height: fit-content;
  }
  #inputDiv input {
    width: -webkit-fill-available;
  }
  #listDiv {
    overflow-y: scroll;
    top: 50px;
    height: -webkit-fill-available;
    width: 100%;
  }
  .apothegmContentHeadertitlebar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(21, 22, 17);
    padding: 5px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .apothegmContentHeadertitlebar button {
    font-size: 1em;
    border-radius: 3px;
    height: fit-content;
    padding: 5px 10px;
  }
  .apothegmContentHeadertitlebar div {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .apothegmContentHeadertitlebar div p {
    font-size: 1.2em;
    font-weight: bold;
    margin: 5px;
  }
  #searchTextContainer {
    border: solid 1px rgb(208, 200, 181);
    box-shadow: 0 0 3px 0 rgb(208, 200, 181);
    background-color: rgb(21, 22, 17);
    color: rgb(208, 200, 181);
    font-family: 'Times New Roman', Times, serif;
    display: flex;
  }
</style>
