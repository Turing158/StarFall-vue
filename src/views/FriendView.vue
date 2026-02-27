<!-- 聊天页面 -->
<template>
  <div>
    <Ul class="ul"></Ul>
    <div class="content">
      <div>
        <Book>
          <table class="chatBlock">
            <tr>
              <th class="listTitle">
                <McBtn :width="50" @click="goBack()" text="返回" :font-size="15"></McBtn>
                <div style="width: 10px"></div>
                <McBtn :width="50" @click="addFriend()" text="添加" :font-size="15"></McBtn>
              </th>
              <th class="userTitle">
                <div class="userTitleMain" v-show="chatTitle && chatTitle != ''">
                  {{ chatTitle }}
                </div>
              </th>
            </tr>
            <tr>
              <td>
                <div class="friendListFrame">
                  <el-dropdown
                    class="FriendListItemFrame"
                    trigger="contextmenu"
                    v-for="(item, index) in friendList"
                    :key="index"
                    @command="handleMenuCommand"
                  >
                    <FriendListItem
                      :item="item"
                      :active="currentFriend && item.user == currentFriend.user"
                      @click="listClick(item, index)"
                    />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :command="handleCommandAndParam('goProfile', item)"
                          >查看主页</el-dropdown-item
                        >
                        <el-dropdown-item :command="handleCommandAndParam('remark', item)">{{
                          item.alais ? '修改备注' : '备注'
                        }}</el-dropdown-item>
                        <el-dropdown-item
                          :command="
                            handleCommandAndParam(item.isTop ? 'cancelTop' : 'setTop', item)
                          "
                        >
                          {{ item.isTop ? '取消顶置' : '顶置' }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          :command="handleCommandAndParam( item.relation == -1 ? 'unBlack' : 'black', item)"
                          >{{ item.relation == -1 ? '取消拉黑' : '拉黑' }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          :command="handleCommandAndParam('delete', item)"
                          style="color: #923a3a"
                          >删除</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </td>
              <td>
                <div ref="chatUserFrame" class="chatUserFrame">
                  <div class="empty" v-if="chats.length == 0 && !isLoadingChat && !currentFriend">
                    空空如也，快去找个伙伴来聊天吧！
                  </div>
                  <div class="empty" v-if="isLoadingChat">加载中...</div>
                  <div class="loading-history" v-if="showHistoryText">加载历史消息中...</div>
                  <div class="chatFrame" v-for="(item, index) in chats" :key="index">
                    <ChatCloudItem :chats="item" :previousDate="chats[index - 1]?.date" />
                  </div>
                </div>

                <div class="sendBlock">
                  <textarea
                    type="text"
                    class="sendBox"
                    v-model="contentValue"
                    :disabled="disableSend"
                  ></textarea>
                  <div class="operate">
                    <div>
                      <McBtn
                        text="发送"
                        @click="send()"
                        :cooldown-tamp="timerStore.sendMsgTimer"
                        :disabled="disableSend"
                      />
                    </div>
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
import FriendListItem from '@/components/FriendListItem.vue'
import ChatCloudItem from '@/components/ChatCloudItem.vue'
import McBtn from '@/components/McBtn.vue'
import { getAllFriend, findMsgByFriend, sendMessage, applyFriend, changeAlias, changeTop, changeRelation } from '@/api/friend'
import { ElCheckbox, ElMessage, ElMessageBox, ElRadio } from 'element-plus'
import { onMounted, onUnmounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import useTimerStore from '@/stores/timer'
import { registerMessageCallback, unregisterMessageCallback } from '@/util/handleNotice'
const chats = ref([])
const contentValue = ref('')
const friendList = ref([])
const friendNum = ref(0)
const chatTitle = ref('')
const disableSend = ref(false)
const currentFriend = ref(null)
const chatUserFrame = ref(null)
const userStore = useUserStore()
const timerStore = useTimerStore()
const router = useRouter()
const isLoadingChat = ref(false)
const isLoadingHistory = ref(false)
const showHistoryText = ref(false)
const goBack = () => {
  router.back()
}
const handleFriendMessage = (data) => {
  if (data.type) {
    return
  }
  handleChangeFriendList(data)
  handleChangeMessage(data)
}
const handleChangeMessage = async (data) => {
  if(currentFriend.value && currentFriend.value.user == data.fromUser){
    console.log(data)
    let index = chats.value.findIndex(i => i.fromUser == data.fromUser && i.toUser == data.toUser && i.date == data.date)
    console.log(index)
    if(index != -1){
      chats.value[index].contents.push(data.content)
    }
    else{
      data.contents = [data.content]
      data.content = undefined
      chats.value.push(data)
    }
    setViewBottom()
  }
}
const handleChangeFriendList = async (data) => {
  let index = friendList.value.findIndex((i) => i.user == data.fromUser)
  let item = friendList.value[index]
  item.lastMsg = data.content
  item.date = data.date
  if (index != -1) {
    friendList.value.splice(index, 1)
  }
  if (item.isTop) {
    friendList.value.unshift(item)
  } else {
    const lastTopIndex = friendList.value.findLastIndex((item) => item.isTop === true)
    if (lastTopIndex === -1) {
      friendList.value.unshift(item)
    } else {
      friendList.value.splice(lastTopIndex + 1, 0, item)
    }
  }
}
const getUserList = async () => {
  await getAllFriend(friendList.value.length)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        console.log(res.data.object)
        let data = res.data.object
        let list = data.key
        for(let i of list){
          if(i.lastMsg){
            let lastMsgs = i.lastMsg.split('[&divide&]')
            i.lastMsg = lastMsgs[lastMsgs.length - 1]
          }
        }
        friendList.value = list
        friendNum.value = data.value
      }
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('服务异常')
    })
}
const setViewBottom = () => {
  setTimeout(()=>{
    chatUserFrame.value.scrollTop = chatUserFrame.value.scrollHeight
  },10)
}
const getFriendMsg = async (fromUser, index) => {
  await findMsgByFriend(fromUser, index)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        let data = res.data.object
        if (data.length > 0) {
          const newChats = []
          for (let i = 0; i < data.length; i++) {
            let contents = data[i].content.split('[&divide&]')
            newChats.push({
              fromUser: data[i].fromUser,
              fromAvatar: data[i].fromAvatar,
              date: data[i].date,
              contents: contents
            })
          }
          chats.value = [...newChats, ...chats.value]
        }
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
      console.log(err)
    })
  if (index === 0) {
    setViewBottom()
  }
  showHistoryText.value = chatUserFrame.value.scrollHeight >= chatUserFrame.value.clientHeight+27
}
const getUserMsg = async (fromUser) => {
  isLoadingChat.value = true
  chats.value = []
  await getFriendMsg(fromUser, 0)
  isLoadingChat.value = false
}
const listClick = (item, index) => {
  if (currentFriend.value && currentFriend.value.user == item.user) {
    return
  }
  chatTitle.value = ''
  currentFriend.value = item
  setTimeout(()=>{
    chatTitle.value = item.alias ? item.alias : item.name
  },10)
  getUserMsg(item.user)
}
const handleCommandAndParam = (command, item) => {
  return {
    command: command,
    item: item
  }
}
const handleMenuCommand = (commandHandle) => {
  let command = commandHandle.command
  let item = commandHandle.item
  switch (command) {
    case 'goProfile':
      router.push('/personal/other/' + item.user)
      break
    case 'remark':
      handleSetRemark(item)
      break
    case 'setTop':
      handleSetTop(item, true)
      break
    case 'cancelTop':
      handleSetTop(item, false)
      break
    case 'black':
      handleBlackFriend(item,true)
      break
    case 'unBlack':
      handleBlackFriend(item,false)
      break
    case 'delete':
      handleDeleteFriend(item)
      break
  }
}

const handleSetRemark = (item) => {
  ElMessageBox.prompt('请输入备注名称', '设置备注', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: item.alias || ''
  })
    .then(async ({ value }) => {
      if(value.length > 15){
        ElMessage.error('备注不能超过15个字符')
        return
      }
      await changeAlias(item.user, value)
      .then(res=>{
        console.log(res)
        if(res.data.msg == 'SUCCESS'){
          item.alias = value
          if(item.alias){
            ElMessage.success('备注设置成功')
          }
          else{
            ElMessage.success('已取消备注')
          }
          if(currentFriend.value && currentFriend.value.user == item.user){
            chatTitle.value = item.alias ? item.alias : item.name
          }
        }
        else{
          ElMessage.error('备注设置失败')
        }
      })
    })
    .catch(() => {
      ElMessage.error('服务异常')
    })
}
const setTop = (item, isTop) => {
  item.isTop = isTop
  const index = friendList.value.findIndex((i) => i.user === item.user)
  if (index !== -1) {
    friendList.value.splice(index, 1)
    if (isTop) {
      let insertIndex = 0
      while (insertIndex < friendList.value.length && friendList.value[insertIndex].isTop) {
        const currentDate = new Date(friendList.value[insertIndex].date)
        const itemDate = new Date(item.date)
        if (itemDate > currentDate) {
          break
        }
        insertIndex++
      }
      friendList.value.splice(insertIndex, 0, item)
    } else {
      const lastTopIndex = friendList.value.findLastIndex((i) => i.isTop === true)
      let insertIndex = lastTopIndex + 1
      while (insertIndex < friendList.value.length) {
        const currentDate = new Date(friendList.value[insertIndex].date)
        const itemDate = new Date(item.date)
        if (itemDate > currentDate) {
          break
        }
        insertIndex++
      }
      friendList.value.splice(insertIndex, 0, item)
    }
  }
}
const handleSetTop = async (item, isTop) => {
  let isSuccess = false
  await changeTop(item.user, isTop)
  .then(res=>{
    console.log(res)
    if(res.data.msg == 'SUCCESS'){
      isSuccess = true
      ElMessage.success('设置成功')
    }
    else{
      ElMessage.error('设置失败')
    }
  })
  .catch(e=>{
    ElMessage.error('服务异常')
  })
  if(isSuccess){
    setTop(item,isTop)
  }
  else{
    setTop(item,!isTop)
  }
}

const handleBlackFriend = async(item, black) =>{
  if(!black){
    await setBlock(item, black)
    return
  }
  ElMessageBox.confirm('确定要拉黑该好友吗？拉黑后将接收不到他的消息', '拉黑好友', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async()=>{
    await setBlock(item, black)
  })
}
const handleBlackBool = (black) => black ? -1 : 0
const setBlock = async(item, black)=>{
  let isSuccess = false
  let oldRelation = item.relation
  await changeRelation(item.user, black)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      isSuccess = true
      ElMessage.success('设置成功')
    }
    else{
      ElMessage.error('设置失败')
    }
  })
  .catch(e=>{
    ElMessage.error('服务异常')
  })
  if(isSuccess){
    item.relation = handleBlackBool(black)
  }
  else{
    item.relation = oldRelation
  }
}
const handleDeleteAfter = (item)=>{
  const index = friendList.value.findIndex((i) => i.user === item.user)
      if (index !== -1) {
        friendList.value.splice(index, 1)
        if (currentFriend.value && currentFriend.value.user === item.user) {
          currentFriend.value = null
          chats.value = []
          chatTitle.value = ''
        }
        ElMessage.success('删除成功')
      }
}
const handleDeleteFriend = (item) => {
  const deleteChat = ref(false)
  ElMessageBox({
    title: 'Message',
    message: h('p', null, [
      h('span', null, '确定要删除该好友吗？'),
      h(ElCheckbox,{ 
        'onUpdate:modelValue': (val) => {
          deleteChat.value = val
        },
      }, '同时删除聊天记录'),
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      
    })
    .catch(() => {})
}
const send = async () => {
  if(!currentFriend.value){
    ElMessage.error('请先选择好友')
    return
  }
  if (contentValue.value.length == 0) {
    ElMessage.error('消息内容不能为空')
    return
  }
  if (contentValue.value.length >= 300) {
    ElMessage.error('消息内容不能超过300字符')
    return
  }
  timerStore.setSendMsgTimer(Date.now() + 5000)
  let tmp = {
    fromUser: userStore.user,
    fromAvatar: userStore.avatar,
    date: "",
    contents: [contentValue.value]
  }
  chats.value.push(tmp)
  let isSuccess = false
  let historyContent = contentValue.value
  contentValue.value = ''
  setViewBottom()
  await sendMessage(currentFriend.value.user, historyContent)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        isSuccess = true
        console.log(res.data.object)
        let data = res.data.object
        data.contents = [data.content]
        let index = chats.value.findIndex(i => i.fromUser == data.fromUser && i.toUser == data.toUser && i.date == data.date)
        if (index != -1) {
          chats.value.splice(chats.value.indexOf(tmp), 1)
          chats.value[index].contents.push(data.content)
        }
        else {
          data.content = undefined
          chats.value[chats.value.indexOf(tmp)] = data
        }
        setViewBottom()
      } else if (msg == 'DISABLE_TO_SELF') {
        ElMessage.error('不允许发送消息至自己')
      }
      else if (msg == 'IS_BLACK') {
        ElMessage.error('你已被对方拉黑')
      }
      else if (msg == 'NO_EXIST_USER') {
        ElMessage.error('用户不存在')
      }
      else {
        ElMessage.error('发送失败')
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
  if(!isSuccess){
    chats.value.splice(chats.value.indexOf(tmp), 1)
    contentValue.value = historyContent
  }
}
const timeDiff = (newDate, oldDate) => {
  let new_date = new Date(newDate)
  let old_date = new Date(oldDate)
  let diffInMilliseconds = new_date.getTime() - old_date.getTime()
  return Math.abs(diffInMilliseconds / (1000 * 60))
}
const addFriend = () => {
  ElMessageBox.prompt(
    `<div>
      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 5px;">用户ID：</label>
        <input class="userInput" type="text" id="friendUser" max-length="20" placeholder="请输入用户ID">
      </div>
      <label style="display: block; margin-bottom: 5px;">添加原因：</label>
    </div>
    <style>
      .userInput{
        width: 100%; 
        padding: 8px; 
        border: 1px solid #dcdfe6; 
        border-radius: 4px;
        outline: 0;
        transition: all 0.2s
      }
      .userInput:hover{
        border: 1px solid #c0c4cc;
      }
      .userInput:focus-visible{
        border: 1px solid #99876c;
      }
    </style>`,
    '添加好友',
    {
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      inputPlaceholder: '请输入原因（5-50）字',
      beforeClose: async(action, instance, done) =>{
        if(action == 'cancel'){
          done()
          return
        }
        const user = document.getElementById('friendUser').value
        if (!user.trim()) {
          ElMessage.error('用户ID不能为空')
          return
        }
        if(user.length > 20){
          ElMessage.error('用户ID不能超过20')
          return
        }
        const reason = instance.inputValue
        if (!reason || !reason.trim()) {
          ElMessage.error('原因不能为空')
          return
        }
        if(reason.length > 50){
          ElMessage.error('原因不能超过50字')
          return
        }
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在提交中...'
        let isSuccess = false
        await applyFriend(user,reason)
        .then(res=>{
          let msg = res.data.msg
          if(msg == 'SUCCESS'){
            ElMessage.success('好友申请已发送')
            isSuccess = true
          }
          else if(msg == 'SUCCESS_ADD'){
            ElMessage.error('成功添加好友')
            getUserList()
            isSuccess = true
          }
          else if(msg == 'USER_NOT_EXIST'){
            ElMessage.error('用户不存在')
          }
          else if(msg == 'ALREADY_FRIEND'){
            ElMessage.error('该用户已添加好友')
          }
          else if(msg == 'APPLICATION_EXIST'){
            ElMessage.error('好友申请已存在')
          }
        })
        .catch(e=>{
          ElMessage.error('服务异常')
        })
        if(isSuccess){
          done()
        }
        instance.confirmButtonLoading = false
        instance.confirmButtonText = '添加'
      }
    }
  )
}
const loadingHistoryMsg = async () => {
  if (isLoadingHistory.value || !currentFriend.value) {
    return
  }
  isLoadingHistory.value = true
  let length = chats.value.length
  const oldScrollHeight = chatUserFrame.value.scrollHeight
  const oldScrollTop = chatUserFrame.value.scrollTop

  await getFriendMsg(currentFriend.value.user, chats.value.length)
  let setScrollTop = 30
  if(chats.value.length != length){
    setScrollTop = oldScrollTop + (chatUserFrame.value.scrollHeight - oldScrollHeight)
  }
  setTimeout(()=>{
    chatUserFrame.value.scrollTop = setScrollTop
    isLoadingHistory.value = false
  },20)
}
const init = async () => {
  await getUserList()
  registerMessageCallback(handleFriendMessage)

  if (chatUserFrame.value) {
    chatUserFrame.value.addEventListener('scroll', handleScroll)
  }
}
onMounted(init)
onUnmounted(() => {
  unregisterMessageCallback(handleFriendMessage)
  if (chatUserFrame.value) {
    chatUserFrame.value.removeEventListener('scroll', handleScroll)
  }
})

const handleScroll = () => {
  if (!chatUserFrame.value) return

  const scrollTop = chatUserFrame.value.scrollTop
  if (scrollTop <= 27 && !isLoadingHistory.value && chats.value.length > 0) {
    loadingHistoryMsg()
  }
}
</script>
<style scoped>
.ul {
  position: fixed;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
.chatBlock {
  width: 100%;
  border-collapse: collapse;
  transition: all 250ms;
}
.chatBlock th {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  background-color: #d6bf8e;
}
.chatBlock .listTitle {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 10px;
}

.chatBlock .userTitle {
  border-top-right-radius: 10px;
}
.chatBlock .userTitle .userTitleMain {
  height: 50px;
  padding-left: 30px;
  line-height: 60px;
  display: flex;
  align-items: center;
  color: #41321f;
  animation: loadingName 0.3s;
}
@keyframes loadingName {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.backBtn {
  margin-right: 15px;
  font-size: 18px;
}
.friendListFrame {
  height: 550px;
  width: 100%;
  border-top: 1px solid #d6bf8e;
  background-color: #f7edd8;
  border-bottom-left-radius: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  animation: startAnim 0.3s;
  transition: all 250ms;
}
.friendListFrame::-webkit-scrollbar {
  width: 6px;
}
.friendListFrame::-webkit-scrollbar-thumb {
  background-color: #c9b896;
  cursor: n-resize;
}
.chatUserFrame {
  height: 350px;
  background-color: #fbf2db;
  border-left: 1px solid #c9b896;
  border-right: 1px solid #c9b896;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.chatUserFrame::-webkit-scrollbar {
  width: 6px;
}
.chatUserFrame::-webkit-scrollbar-thumb {
  background-color: #c9b896;
  cursor: n-resize;
}
.sendBlock {
  width: 775px;
  height: 200px;
  background-color: #f8f1e0;
  border-top: 1px solid #c9b896;
  border-left: 1px solid #c9b896;
  border-right: 1px solid #c9b896;
}
.sendBox {
  border: 0;
  outline: none;
  width: 760px;
  height: 150px;
  font-size: 18px;
  padding: 5px;
  resize: none;
  background-color: #f8f1e0;
}
.operate {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  height: 60px;
  background-color: #f0e8d0;
}
.empty {
  position: absolute;
  top: 50%;
  left: 40%;
  /* transform: translate(-50%, 0); */
  text-align: center;
  font-size: 15px;
  color: #666;
  padding: 10px 0;
  animation: startAnim 0.3s;
}
.loading-history {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 5px 0;
}
.chatFrame {
  animation: startAnim 0.3s;
}
@keyframes startAnim {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
