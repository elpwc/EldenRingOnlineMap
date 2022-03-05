<script lang="ts">
  /**
   * 讯息页
   */
  import { onMount } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import { currentPageStore, ip, isAdminModeStore } from '../stores';
  import { fly } from 'svelte/transition';
  import axios from 'axios';
  import type { Apothegm } from '../utils/typings';
  // 用来根据ip地址生成匿名用户名
  import md5 from 'md5';

  // 路径参数: 讯息id
  // 仅用来从外部直接打开讯息，从网页内部打开讯息不使用这个
  export let params = { id: null };

  /** 是否是管理页模式 */
  let isAdminMode = false;

  isAdminModeStore.subscribe(v => {
    isAdminMode = v;
  });

  onMount(() => {
    currentPageStore.set('apothegm');

    // 加载讯息
    refreshApo();
  });

  /** 发送讯息Modal */
  let postModalVisibility = false;
  /** 回复Modal */
  let replyModalVisibility = false;
  /** 分享链接Modal */
  let copyModalVisibility = false;
  /** 删除讯息确认框 */
  let deleteConfirmVisibility = false;

  /** 搜索框内容 */
  let searchWord = '';

  /** 删的是讯息的回复还是讯息 apo: true, reply: false */
  let deleteReply = false;

  /** 当前打开的讯息id */
  let currentShowingApoId = 0;
  /** 当前打开的讯息index */
  let currentShowingApoIndex = -1;

  /** 当前打开的讯息回复id */
  let currentClickedReplyId = 0;
  /** 当前打开的讯息回复index */
  let currentClickedReplyIndex = -1;

  /** 要发送的讯息标题 */
  let postTitle = '';
  /** 要发送的讯息内容 */
  let postContent = '';
  /** 要发送的讯息的姿态（未使用 */
  let postGesture = '';

  /** 是否显示自己发的讯息 */
  let showSelf = false;
  /** 要发送的回复内容 */
  let replyContent = '';

  /** 是否处于搜索结果展示模式 */
  let isSearch = false;

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
    if (postTitle !== '') {
      if (postTitle.length <= 20 && postContent.length <= 1000) {
        axios
          .post('./apothegm.php', {
            title: postTitle,
            content: postContent,
            like: 0,
            dislike: 0,
            ip,
          })
          .then(res => {
            console.log(res);
            postModalVisibility = false;
            postContent = '';
            postTitle = '';

            refreshApo(/*res.data?.id*/);
          });
      } else {
        alert('标题(≤20)/内容(≤1000)太长了~');
      }
    } else {
      alert('请填写标题再提交~');
    }
  };

  /**
   * 根据ip获取对应的匿名id
   * @param ip IP
   */
  const getMD5Id = (ip: string) => {
    return md5(ip).substring(0, 6);
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
        alert('内容(≤1000)太长了~');
      }
    } else {
      alert('请填写内容再提交~');
    }
  };

  /** 对讯息好评 */
  const onLikeApo = () => {
    axios
      .patch('./apothegm.php', {
        id: currentShowingApoId,
        like: Number(apothegms?.[currentShowingApoIndex]?.like) + 1,
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
        dislike: Number(apothegms?.[currentShowingApoIndex]?.dislike) + 1,
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
        like: Number(apothegms?.[currentShowingApoIndex]?.replies?.[currentClickedReplyIndex]?.like) + 1,
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
        dislike: Number(apothegms?.[currentShowingApoIndex]?.replies?.[currentClickedReplyIndex]?.dislike) + 1,
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
</script>

<div class="container">
  <!--搜索 添加栏-->
  <header id="inputDiv">
    <div style="display: flex;">
      <div id="searchTextContainer">
        <input type="text" style="border: none; width: 80%; box-shadow: none;" placeholder="搜索讯息" bind:value={searchWord} />
        {#if isSearch}
          <button
            style="border: none; font-size: 0.6em; box-shadow: none;"
            on:click={() => {
              isSearch = false;
              searchWord = '';
              refreshApo();
            }}>清除结果</button
          >
        {/if}
      </div>
      <button on:click={onSearch}
        ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
          />
        </svg>搜索</button
      >
    </div>
    <button
      style="border: none; box-shadow: none;"
      on:click={() => {
        postModalVisibility = true;
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
        <path
          d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
        />
        <path
          fill-rule="evenodd"
          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
        />
      </svg>写下讯息
    </button>
    <button
      style="border: none; box-shadow: none;"
      on:click={() => {
        showSelf = !showSelf;
        refreshApo();
      }}
      class={showSelf ? 'selfactive' : ''}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
        <path
          fill-rule="evenodd"
          d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
        />
      </svg>
      我发送的</button
    >
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
                    <path
                      d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"
                    />
                  </svg>[置顶]
                {/if}{@html apo?.title}</span
              >
            </div>
          </div>
          <!--<p>默认把\n处理为空格，所以需要转义为<br />-->
          <p class="contentp">{@html apo?.content?.replaceAll('\n', '<br />')}</p>

          <div class="title-reply" style="justify-content: space-between; ">
            <span class="replyspan">回应 {apo?.replies?.length}</span>
            <span class="datespan">{apo?.reply_date}</span>
            <span class="likespan">好评 {apo?.like} 恶评 {apo?.dislike}</span>
          </div>
        </div>
      {/each}
    {/if}
  </main>

  <!--讯息详情-->
  {#if currentShowingApoId > 0}
    <div id="apothegmContent" transition:fly={{ x: window.innerWidth, duration: 300 }}>
      <header id="apothegmContentHeader">
        <div class="apothegmContentHeadertitlebar">
          <div>
            <button
              on:click={() => {
                currentShowingApoId = 0;
                currentShowingApoIndex = -1;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
              返回</button
            >
          </div>
          <div>
            {#if isAdminMode || apothegms?.[currentShowingApoIndex]?.ip === ip}
              <button
                on:click={() => {
                  // 设置删除的是讯息还是回复
                  deleteReply = false;
                  deleteConfirmVisibility = true;
                }}>删除</button
              >
            {/if}
            <button on:click={onShare}>分享</button>
            <button
              on:click={() => {
                replyModalVisibility = true;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                <path
                  d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                />
                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              回复</button
            >
          </div>
        </div>

        <div>
          <p style="font-size: 1.2em; font-weight: bold; ">{@html apothegms?.[currentShowingApoIndex]?.title}</p>

          <p>{@html apothegms?.[currentShowingApoIndex]?.content?.replaceAll('\n', '<br />')}</p>
          <div class="title">
            <div class="title-reply">
              <span class="titlespan">{getMD5Id(apothegms?.[currentShowingApoIndex]?.ip)}</span><span class="replyspan">回应 {apothegms?.[currentShowingApoIndex]?.replies?.length}</span>
            </div>
            <span class="datespan">{apothegms?.[currentShowingApoIndex]?.create_date}</span>
            <div>
              <button on:click={onLikeApo}>好评 {apothegms?.[currentShowingApoIndex]?.like}</button>
              <button on:click={onDislikeApo}>恶评 {apothegms?.[currentShowingApoIndex]?.dislike}</button>
            </div>
          </div>
        </div>
      </header>

      <!--回复列表-->
      <main>
        {#if apothegms?.[currentShowingApoIndex]?.replies?.length > 0}
          {#each apothegms?.[currentShowingApoIndex]?.replies as reply, index (reply.id)}
            <div class="apothegm" on:click={() => {}}>
              <div class="title">
                <div class="title-reply"><span class="titlespan">{'#' + String(index + 1) + ' ' + getMD5Id(reply?.ip)}</span></div>
                <div class="title-reply">
                  <span class="datespan">{reply?.create_date}</span>
                  {#if isAdminMode || reply?.ip === ip}
                    <button
                      on:click={() => {
                        currentClickedReplyId = reply.id;
                        currentClickedReplyIndex = index;

                        // 设置删除的是讯息还是回复
                        deleteReply = true;
                        deleteConfirmVisibility = true;
                      }}>删除</button
                    >
                  {/if}
                  <span class="likespan">
                    <button
                      on:click={() => {
                        currentClickedReplyId = reply?.id;
                        currentClickedReplyIndex = index;
                        onLikeReply();
                      }}>好评 {reply?.like}</button
                    >
                    <button
                      on:click={() => {
                        currentClickedReplyId = reply?.id;
                        currentClickedReplyIndex = index;
                        onDislikeReply();
                      }}>恶评 {reply?.dislike}</button
                    >
                  </span>
                </div>
              </div>
              <p class="contentp">{@html reply?.content?.replaceAll('\n', '<br />')}</p>
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
  width="70%"
  title="写下讯息"
  showOkButton
  showCloseButton
  okButtonText="写下讯息"
  closeButtonText="收回褪色者手指"
  onOKButtonClick={onPost}
  onCloseButtonClick={() => {
    postModalVisibility = false;
    postContent = '';
    postTitle = '';
  }}
>
  <div class="modalInner">
    <input type="text" placeholder="标题 (1～20)" bind:value={postTitle} />
    <textarea placeholder="内容 (0～1000)" bind:value={postContent} />
  </div>
</Modal>

<!--回应讯息Modal-->
<Modal
  visible={replyModalVisibility}
  width="70%"
  title="写下对讯息的回应"
  showOkButton
  showCloseButton
  okButtonText="回应"
  closeButtonText="收回褪色者手指"
  onOKButtonClick={onReply}
  onCloseButtonClick={() => {
    replyModalVisibility = false;
    replyContent = '';
  }}
>
  <div class="modalInner">
    <textarea placeholder="内容 (0～1000)" bind:value={replyContent} />
  </div>
</Modal>

<!--分享复制讯息Modal-->
<Modal
  visible={copyModalVisibility}
  title="请长按复制"
  showOkButton
  okButtonText="返回"
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
  okButtonText="确认删除"
  closeButtonText="取消"
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

<style>
  .modalInner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 40px;
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
    font-size: 1.1em;
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
  }
  .apothegm {
    border-bottom: solid 1px rgb(204, 178, 118);
    margin: 0px 10px;
    padding: 5px;
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
    border: solid 1px rgb(204, 178, 118);
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
  }
  #apothegmContent {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 70px;
  }
  #apothegmContent main {
    background-color: rgb(21, 22, 17, 0.9);
    height: -webkit-fill-available;
    margin-bottom: 160px;
    overflow-y: scroll;
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
