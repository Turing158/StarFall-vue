<!-- 聊天页面 -->
<template>
  <div>
    <Ul class="ul"></Ul>
    <GoBack />
    <div class="content">
      <div>
        <Book>
          <table class="noticeBlock">
            <tr>
              <th class="listTitle">
                <div class="title">通知</div>
                <button class="markAllRead" v-if="userStore.unreadNum > 0" @click="markAllAsRead">全部已读</button>
              </th>
            </tr>
            <tr>
              <td>
                <div class="noticeList" ref="noticeListRef" @scroll="handleScroll">
                  <div v-if="notices.length === 0" class="empty">
                    <p>暂无通知</p>
                  </div>
                  <div
                    v-for="(notice, index) in notices"
                    :key="index"
                    class="noticeItem"
                    @click="toRead(notice)"
                  >
                    <div class="noticeIcon">
                      <img :src="getNoticeIcon(notice.type)" :alt="notice.type" />
                    </div>
                    <div class="noticeInfo">
                      <div class="noticeTitle">{{ notice.title }}</div>

                      <div
                        v-if="notice.type === 'friend' && notice.action.name"
                        class="noticeContent friendType"
                      >
                        <img :src="getAvatarSrc(notice.action.avatar)" class="friendAvatar" />
                        <div class="friendInfo">
                          <div class="friendName">{{ notice.action.name }}</div>
                          <div class="friendReason">{{ notice.action.reason }}</div>
                        </div>
                        <div class="friendActions">
                          <button
                            class="actionButton acceptButton"
                            @click="handleFriendAccept(notice,true)"
                            v-show="!notice.action.handled"
                          >
                            接受
                          </button>
                          <button
                            class="actionButton rejectButton"
                            @click="handleFriendAccept(notice,false)"
                            v-show="!notice.action.handled"
                          >
                            拒绝
                          </button>
                          <div class="isAction" v-show="notice.action.handled">
                            {{ notice.action.status == 1 ? '已接受' : notice.action.status == -1 ? '已拒绝' : '处理中...' }}
                          </div>
                        </div>
                      </div>

                      <div
                        v-else-if="notice.type === 'friend' && !notice.action.name"
                        class="noticeContent"
                      >
                        你发送给对方(<a
                          :href="`/personal/other/${notice.action.user}`"
                          target="_blank"
                          title="点击跳转"
                          >{{ notice.action.user }}</a
                        >)的好友申请已处理，对方
                        <span class="green" v-if="notice.action.status == 1">同意</span>
                        <span class="red" v-else>不同意</span>
                        添加你为好友
                      </div>

                      <div v-else-if="notice.type === 'topic'" class="noticeContent topicType">
                        <div class="topicText">
                          <span v-if="notice.action.operator">你的</span>主题帖 (<a
                            :href="`/topic/detail/${notice.action.id}`"
                            target="_blank"
                            title="点击跳转"
                            >{{ notice.action.title }}</a
                          >) 
                          <span v-if="notice.action.operator">显示状态已更新为：</span>
                          <span v-else>已整改完毕！<br/>请再次审核该主题，并操作主题状态！</span>
                          <span v-if="notice.action.operator">
                            <span class="red" v-if="notice.action.status == -1">待整改</span>
                            <span class="green" v-else>正常显示</span>
                          </span>
                          <div v-if="notice.action.operator">
                            操作员：<a
                              :href="`/personal/other/${notice.action.operator}`"
                              target="_blank"
                              title="点击跳转"
                              v-if="notice.action.reason"
                              >{{ notice.action.operator }}</a
                            >
                            <br />
                            原因：{{ notice.action.reason }}
                          </div>
                        </div>
                        <div class="topicOperate" :class="!notice.action.operator ? 'againOperate' : ''">
                          <button v-if="!notice.action.handle && notice.action.operator && notice.action.status == -1" class="actionButton" @click="completeAdjust(notice)">已整改</button>
                          <button v-if="notice.action.handle && notice.action.operator" class="actionButton disableBtn">已通知</button>
                          <button v-if="!notice.action.handle && !notice.action.operator" class="actionButton" @click="operateTopic(notice)">操作</button>
                          <button v-if="notice.action.handle && !notice.action.operator" class="actionButton disableBtn">已处理</button>
                          <button class="actionButton" @click="goToTopic(notice.action.id)">前往</button> 
                        </div>
                      </div>

                      <div v-else-if="notice.type === 'live'" class="noticeContent">
                        你的直播申请 (<a
                          :href="notice.action.url"
                          target="_blank"
                          title="点击跳转"
                          >{{ notice.action.url }}</a
                        >) 已审核完成，结果如下：
                        <span class="green" v-if="notice.action.status == 1">已通过</span>
                        <span class="red" v-else>未通过</span>
                        <br />
                        操作员：<a
                          :href="`/personal/other/${notice.action.operator}`"
                          target="_blank"
                          title="点击跳转"
                          >{{ notice.action.operator }}</a
                        >
                        <br />
                        原因：{{ notice.action.reason }}
                      </div>

                      <div v-else-if="notice.type === 'msg'" class="noticeContent">
                        <div class="medal-notice" v-if="notice.action && notice.action.medal">
                          <img class="medal-icon" :src="`/src/assets/img${notice.action.icon}`" alt="">
                          <div class="medal-info">
                            <span>
                              恭喜你获得了 <span class="medan-name">{{ notice.action.medal }}</span> 勋章！
                            </span>
                            <span>
                              获得时间：{{ notice.action.gainTime }}
                            </span>
                            <span v-if="notice.action.expireTime">
                              过期时间：{{ notice.action.expireTime }}
                            </span>
                          </div>
                        </div>
                        <div v-else>{{ notice.action }}</div>
                      </div>


                      <div v-else-if="notice.type === 'all'" class="noticeContent allType">
                        <img
                          :src="getImageUrl(notice.action.img)"
                          class="allImage"
                        />
                        <div class="allDetail">
                          <div class="allText">{{ notice.action.content }}</div>
                          <div class="subText">{{ notice.action.subContent }}</div>
                        </div>
                        <button class="actionButton" style="height: 30px;" @click="goToTopic(notice.action.id)">前往</button>
                      </div>

                      <div class="noticeTime">{{ handleTime(notice.createTime, true) }}</div>
                    </div>
                    <div class="noticeStatus">
                      <span v-if="notice.status === 0 && notice.type !== 'all'" class="unreadDot"></span>
                    </div>
                  </div>
                  <div class="loading" @click="!isLoading && loadMoreNotices()">
                    <span v-if="isLoading">加载中...</span>
                    <span v-else>点击加载更多</span>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </Book>
      </div>
    </div>
  </div>
</template>
<script setup>
import Ul from '@/components/UlBar.vue'
import Book from '@/components/Book.vue'
import McBtn from '@/components/McBtn.vue'
import GoBack from '@/components/GoBack.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import { getNoticeIcon, handleTime, registerMessageCallback, unregisterMessageCallback } from '@/util/handleNotice.js'
import { findAllUserNotice, readNotice } from '@/api/notice'
import { getAvatarSrc } from '@/api/user'
import { handleFriendApplication } from '@/api/friend'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adjustTopicDisplayAgain, completeAdjustTopic } from '@/api/topic'
const notices = ref([])
const isLoading = ref(false)
const userStore = useUserStore()
const router = useRouter()

const goBack = () => {
  router.back()
}

const websoketOnmessage = (data) => {
  if(notices.value){
    data.action = JSON.parse(data.action)
    notices.value = [data, ...notices.value]
  }
}

const init = async () => {
  getNotice(0)
  registerMessageCallback(websoketOnmessage)
}
const getNotice = async (index) => {
  await findAllUserNotice(index).then((res) => {
    let datas = res.data.object
    isEnd.value = datas.length == 0
    for (let item of datas) {
      item.action = JSON.parse(item.action)
      notices.value.push(item)
    }
  })
}
const handleFriendAccept = async(notice,accept) => {
  let tmp = notice.action.status
  notice.action.status = 2
  notice.action.handled = true
  await handleFriendApplication(notice.id,notice.action.id,accept)
  .then(res=>{
    let msg = res.data.msg
    if(msg == 'APPLICATION_NOT_EXIST'){
      ElMessage.error('该申请不存在')
    }
    else if(msg == 'NO_PERMISSION'){
      ElMessage.error('您没有权限操作')
    }
    else if(msg == 'APPLICATION_ALREADY_PROCESSED'){
      ElMessage.warning('该申请已处理')
    }
    else{
      ElMessage.success(`成功${accept ? '同意' : '拒绝'}好友申请`)
      notice.action.status = res.data.object ? 1 : -1
    }
    
  })
  .catch(e=>{
    ElMessage.error("服务异常")
  })
  if(notice.action.status == 2){
    notice.action.status = tmp
    notice.action.handled = false
  }
}

const goToTopic = (id) => {
  router.push({ name: 'topicDetail', params: { id: id } })
}

const completeAdjust = async(notice)=>{
  notice.action.handle = true
  let isSuccess = false;
  await completeAdjustTopic(notice.id,notice.action.id)
  .then(res=>{
    let msg = res.data.msg
    if(msg == 'SUCCESS'){
      ElMessage.success('已完成整改')
      isSuccess = true
    }
    else if(msg == 'NO_PERMISSION'){
      ElMessage.error('您没有权限操作')
    }
    else if(msg == 'NOT_AFTER_1_DAY'){
      ElMessage.error('帖子超过1天未编辑，若已整改编辑，请在完成编辑后1天内并完成整改')
    }
    else if(msg == 'NOT_BEFORE_5_MIN'){
      ElMessage.error('请修改帖子后，5分钟后再完成整改')
    }
    else if(msg == 'NOT_EXIST_NOTICE'){
      ElMessage.error('该通知不存在')
    }
    else if(msg == 'ALREADY_HANDLE'){
      ElMessage.error('该通知已处理')
    }
    else if(msg == 'NOT_EXIST_TOPIC'){
      ElMessage.error('该帖子不存在')
    }
  })
  .catch(e=>{
    ElMessage.error('服务异常')
  })
  if(!isSuccess){
    notice.action.handle = false
  }
}

const operateTopic = async(notice) => {
  let isClose = false
  let reason = ''
  let canDisplay = false
  await ElMessageBox.prompt('请操作该主题的显示状态，是否符合主题规范。若不符合请输入原因，并点击“再次整改”按钮；符合请点击“恢复”按钮', '提示', {
    confirmButtonText: '再次整改',
    cancelButtonText: '恢复',
    distinguishCancelAndClose: true,
    inputValidator: (value) => {
      if (!value) {
        return '请输入整改原因'
      }
      return true
    }
  }).then(({ value }) => {
    reason = value
    canDisplay = false
  }).catch((action) => {
    canDisplay = true
    if(action == 'close'){
      isClose = true
    }
  })
  if(isClose){
    return 
  }
  if (!canDisplay && !reason) {
    ElMessage.error('请输入整改原因')
    return
  }
  let isSuccess = false
  notice.action.handle = true
  await adjustTopicDisplayAgain(notice.action.id, reason, canDisplay ? 1 : -1, notice.id)
  .then(res=>{
    let msg = res.data.msg
    if(msg == 'SUCCESS'){
      ElMessage.success('操作成功')
      isSuccess = true
    }
    else if(msg == 'NO_PERMISSION'){
      ElMessage.error('您没有权限操作')
    }
    else if(msg == 'DONT_DO'){
      ElMessage.error('该操作不符合规范')
    }
    else if(msg == 'ALREADY_HANDLE'){
      ElMessage.error('该通知已处理')
    }
    else if(msg == 'NOT_EXIST_TOPIC'){
      ElMessage.error('该帖子不存在')
    }
    else if(msg == 'NOT_AFTER_5_MIN'){
      ElMessage.error('请仔细审核，5分钟内不能再次审核该帖子')
    }
  })
  .catch(e=>{
    ElMessage.error('服务异常')
  })
  if(!isSuccess){
    notice.action.handle = false
  }
}

const toRead = async (notice) => {
  if (notice.status != 0 || notice.type === 'all') {
    return
  }
  notice.status = 1
  let tmp = {
    id: notice.id,
    user: notice.user,
    createTime: notice.createTime,
    title: notice.title,
    type: notice.type,
    status: notice.status,
    action: JSON.stringify(notice.action)
  }
  await readNotice([tmp])
    .then((res) => {
      ElMessage.success('已读成功')
    })
    .catch((e) => {
      ElMessage.error('已读失败')
      notice.status = 0
    })
}
const markAllAsRead = async () => {
  let tmp = notices.value
  notices.value.forEach((item) => {
    item.status = 1
  })
  await readNotice([])
    .then((res) => {
      ElMessage.success('已读成功')
      userStore.setUnreadNum(0)
    })
    .catch((e) => {
      ElMessage.error('已读失败')
      notices.value = tmp
    })
}
const isEnd = ref(false)
const handleScroll = (event) => {
  if (isEnd.value) {
    return
  }
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadMoreNotices()
  }
}
const loadMoreNotices = async () => {
  console.log("触发loadMoreNotices")
  if (isEnd.value) {
    return
  }
  console.log("获取")
  await getNotice(notices.value.length)
}
const getImageUrl = (img) => {
  return img.includes(':') ? img : `/src/assets/img${img}`
}
onMounted(init)
onUnmounted(()=>{
  unregisterMessageCallback(websoketOnmessage)
})
</script>
<style scoped>
.ul {
  position: fixed;
}
table {
  border-radius: 10px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
.noticeBlock {
  width: 100%;
  border-collapse: collapse;
}
.noticeBlock th {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}
.noticeBlock .listTitle {
  background-image: url('@/assets/img/set/oak.png');
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
}
.noticeBlock .listTitle .title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #f3e6c7;
  font-size: 25px;
  font-weight: bold;
  margin: 0;
}
.markAllRead {
  padding: 6px 16px;
  background-color: #f3e6c7;
  color: #1d1d1d;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}
.markAllRead:hover {
  background-color: #5c5542;
  color: white;
}

.noticeBlock .userTitle .userTitleMain {
  height: 50px;
  padding-left: 30px;
  line-height: 60px;
  display: flex;
  align-items: center;
}
.backBtn {
  margin-right: 15px;
  font-size: 18px;
}
.noticeList {
  height: 550px;
  /* height: 1000px; */
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 250ms;
}
.noticeList::-webkit-scrollbar {
  width: 6px;
}
.noticeList::-webkit-scrollbar-thumb {
  background-color: #756c53;
  cursor: n-resize;
}
.noticeItem {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background-color: #faf8f3;
  border-bottom: 1px solid #e8e4d9;
  transition: all 0.3s;
  cursor: pointer;
}
.noticeItem:hover {
  background-color: #f5f0e6;
  transform: translateX(5px);
}
.noticeIcon {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  flex-shrink: 0;
}
.noticeIcon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.noticeInfo {
  flex: 1;
  min-width: 0;
}
.noticeTitle {
  font-size: 16px;
  font-weight: bold;
  color: #5c4d3c;
  margin-bottom: 5px;
}
.noticeContent {
  font-size: 14px;
  color: #6b5d4d;
  margin-bottom: 8px;
  line-height: 1.5;
}
.noticeContent img{
  image-rendering: auto;
}
.friendType {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.friendAvatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.friendInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.friendName {
  font-size: 15px;
  font-weight: bold;
  color: #5c4d3c;
}
.friendReason {
  font-size: 14px;
  color: #6b5d4d;
  line-height: 1.5;
}
.friendActions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.actionButton {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  color: #131313;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  background-image: url('@/assets/img/set/oak.png');
}
.actionButton:hover {
  transform: scale(1.1);
}
.disableBtn{
  opacity: 0.8;
  cursor: not-allowed;
}
.disableBtn:hover{
  transform: scale(1);
}
.acceptButton {
  background-image: url('@/assets/img/set/birch.png');
}
.rejectButton {
  background-image: url('@/assets/img/set/spruce.png');
  color: #f1f1f1;
}
.topicType {
  display: flex;
  flex-direction: row;
  gap: 10px;
  -webkit-line-clamp: unset;
}

.topicOperate {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.topicOperate.againOperate{
  height: 30px;
  flex-direction: row;
}
.topicText {
  font-size: 14px;
  color: #6b5d4d;
  line-height: 1.5;
  flex: 1;
}
.medal-notice{
  display: flex;
  align-items: flex-start;
}
.medal-icon {
  width: 80px;
  height: 80px;
  margin-right: 5px;
  flex-shrink: 0;
  image-rendering: auto;
  border-radius: 4px;
  border: 2px solid #835a26;
}
.medal-info{
  padding: 5px 2px;
  display: flex;
  flex-direction: column;
}
.medan-name{
  font-size: 14px;
  font-weight: bold;
  color: #756f68;
  margin-bottom: 8px;
  padding: 0px 4px;
}
.allType {
  display: flex;
  gap: 10px;
  -webkit-line-clamp: unset;
}
.allImage {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}
.allDetail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
}
.allText {
  font-size: 14px;
  color: #6b5d4d;
  line-height: 1.5;
  flex: 1;
  margin-bottom: 8px;
}
.subText{
  font-size: 12px;
  color: #8b7d6d;
  font-style: italic;
}

.noticeTime {
  font-size: 12px;
  color: #8b7d6d;
}
.noticeStatus {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}
.unreadDot {
  width: 8px;
  height: 8px;
  background-color: #835a26;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.sendBlock {
  width: 100%;
  height: 200px;
  background-color: #f1f1f1;
}
.sendBox {
  border: 0;
  outline: none;
  width: 720px;
  height: 140px;
  font-size: 18px;
  padding: 10px;
  resize: none;
  background-color: #f1f1f1;
}
.operate {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  height: 60px;
  background-color: #f5f5f5;
}
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loading {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  background-color: #faf8f3;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: all 0.3s;
}
.loading:hover {
  background-color: #f5f0e6;
}
.loading span {
  font-size: 14px;
  color: #6b5d4d;
}
.red {
  color: #970f11;
}
.green {
  color: #0ea509;
}
</style>
