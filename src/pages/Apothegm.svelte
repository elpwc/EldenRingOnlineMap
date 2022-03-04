<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import { currentPageStore, ip, isAdminModeStore } from '../stores';
  import { fly } from 'svelte/transition';
  import axios from 'axios';
  import type { Apothegm } from '../utils/typings';
  import md5 from 'md5';

  export let params = { id: null };

  let isAdminMode = false;

  isAdminModeStore.subscribe(v => {
    isAdminMode = v;
  });

  onMount(() => {
    currentPageStore.set('apothegm');

    refreshApo();
  });

  let postModalVisibility = false;
  let replyModalVisibility = false;
  let copyModalVisibility = false;
  let deleteConfirmVisibility = false;
  let searchWord = '';

  let deleteReply = false; // apo: true, reply: false

  let currentShowingApoId = 0;
  let currentShowingApoIndex = -1;

  let currentClickedReplyId = 0;
  let currentClickedReplyIndex = -1;

  let postTitle = '';
  let postContent = '';
  let postGesture = '';
  let showSelf = false;
  let replyContent = '';

  let isSearch = false;

  let apothegms: Apothegm[] = [];

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

  if (params?.id) {
    currentShowingApoId = params?.id;
    refreshCurrentShowingApoIndex();
  }

  const refreshApo = (id: number = 0) => {
    if (id > 0) {
      axios
        .get('./apothegm.php', {
          params: { id },
        })
        .then(res => {
          console.log(res.data);
          apothegms[
            apothegms.findIndex(f => {
              return f.id === id;
            })
          ] = (res.data as Apothegm[])?.[0];
        });
    } else {
      axios
        .get('./apothegm.php', {
          params: {
            kword: isSearch ? searchWord : '',
            ip: showSelf ? ip : '',
          },
        })
        .then(res => {
          console.log(res.data);
          apothegms = res.data as Apothegm[];
        });
    }
  };

  const onSearch = () => {
    if (searchWord !== '') {
      isSearch = true;

      axios.post('./searchUpload.php', {
        content: searchWord,
        ip,
        position: 'apothegm',
      });

      refreshApo();
    }
  };

  const onPost = () => {
    if (postTitle !== '') {
      if (postTitle.length <= 20 || postContent.length <= 1000) {
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

  const getMD5Id = (ip: string) => {
    return md5(ip).substring(0, 6);
  };

  const onShare = () => {
    copyModalVisibility = true;
  };

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
  <div id="inputDiv">
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
  </div>
  <div id="listDiv">
    {#if apothegms?.length > 0}
      {#each apothegms as apo (apo.id)}
        <div
          class="apothegm"
          on:click={() => {
            currentShowingApoId = apo?.id;
            refreshCurrentShowingApoIndex();
          }}
        >
          <div class="title">
            <div class="title-reply"><span class="titlespan">{@html apo?.title}</span></div>
          </div>
          <p class="contentp">{@html apo?.content?.replaceAll('\n', '<br />')}</p>

          <div class="title-reply" style="justify-content: space-between; ">
            <span class="replyspan">回应 {apo?.replies?.length}</span>
            <span class="datespan">{apo?.reply_date}</span>
            <span class="likespan">好评 {apo?.like} 恶评 {apo?.dislike}</span>
          </div>
        </div>
      {/each}
    {/if}
  </div>

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
</div>
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
<Modal
  visible={deleteConfirmVisibility}
  top="30%"
  zindex={114700}
  showOkButton
  showCloseButton
  okButtonText="确认删除"
  closeButtonText="取消"
  onOKButtonClick={() => {
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
