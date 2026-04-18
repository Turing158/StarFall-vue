<!-- 直播列表页面 -->
<template>
  <div>
    <Book>
      <div class="opearte">
        <div class="left-buttons">
          <McBtn text="申 请" @click="appendLive(true)"/>
        </div>
        <div class="right-buttons">
          <McBtn text="历史申请" @click="appendLive(false)"/>
          <div style="width: 10px;"></div>
          <McBtn text="待审核申请" v-if="userStroe.role == 'admin' || userStroe.role == 'live_moderator'" @click="handleWaitList()"/>
        </div>
      </div>
      <Empty :height="10" />
      <div class="ad">
        <el-carousel trigger="click" 
            v-loading="isAdLoading" 
            element-loading-background="#fbf2db"
            element-loading-text="加载中...">
          <el-carousel-item v-for="(item,index) in ads" :key="index">
            <a :href="item.link">
              <img class="adImg" :src="adPictureApi + item.file" alt="" width="100%" />
            </a>
            <div class="carousel-texts">
              {{ item.title }}
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <Empty :height="10" />
      <div>
        平台:
        <el-select style="width: 150px; margin-right: 10px" v-model="selectVersion" @change="getLive">
          <el-option v-for="item in topicVersion" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <Empty :height="10" />
      <div class="live-item" v-for="(item,index) in liveData" :key="index">
        <div class="live-header">
          <div class="live-info">
            <div class="live-title">{{ item.title ? item.title : "标题加载中..." }}</div>
            <div class="live-username">
              <div class="live-avatar">
                <img :src="item.avatar"
                 @click="goToSpace(item.uid)"
                 referrerpolicy="no-referrer" alt="主播头像" />
              </div>
              <span @click="goToSpace(item.uid)">{{ item.username ? item.username : "主播加载中..." }}</span>
            </div>
          </div>
          <div class="live-actions">
            <McBtn text="前往直播间" @click="goToLive(item.playUuid)"/>
            <div class="live-status">
              <span :class="['status-indicator', item.live_status == 1 ? 'live' : item.live_status == 2 ? 'play' : 'offline']"></span>
              <span>{{ item.live_status == 1 ? '直播中' : item.live_status == 2 ? '未开播,轮播中' : '未开播'}}</span>
              <span v-if="item.live_status == 1" class="live-viewers">
                {{ item.viewers ? item.viewers+' 人看过' : '加载中...' }} 
              </span>
            </div>
          </div>
        </div>
        <div class="live-content">
          <iframe class="live-iframe" 
          style="width: 100%;height: 500px;" 
          :src="'https://www.bilibili.com/blackboard/live/live-activity-player.html?cid='+item.playUuid+'&quality=0'" 
          frameborder="no" framespacing="0" 
          scrolling="no" allow="encrypted-media" ></iframe>
        </div>
      </div>
    
      <Empty :height="10" />
      <!-- 提交直播申请模态框 -->
      <el-dialog
        title="提交直播申请"
        v-model="applyVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" label-width="80px">
          <el-form-item label="直播链接" prop="url">
            <el-input 
              v-model="applyForm.url" 
              placeholder="请输入直播链接" 
              maxlength="150" 
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="直播平台" prop="platform">
            <el-select v-model="applyForm.platform" placeholder="请选择直播平台">
              <el-option label="bilibili" value="bilibili" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 历史申请模态框 -->
      <el-dialog
        title="历史申请"
        v-model="historyVisible"
        width="800px"
        :close-on-click-modal="false"
      >
        <div class="history-list">
          <el-table :data="historyList" style="width: 100%">
            <el-table-column prop="url" label="直播链接" width="300">
              <template #default="{row}">
                <a :href="row.url" target="_blank" class="live-url">{{ row.url }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="直播平台" width="120" />
            <el-table-column prop="applyTime" label="申请时间" width="180" />
            <el-table-column prop="status" label="审核状态" width="120">
              <template #default="{row}">
                <el-tag :type="row.status === 1 ? 'success' : row.status === -1 ? 'danger' : 'warning'">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" width="200" />
            <el-table-column label="审核员" width="300">
              <template #default="{row}">
                {{ row.operator ? row.operatorName + '(' + row.operator + ')' : '未审核' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template #default="{row}">
                <el-button type="danger" size="small" @click="handleDeleteHistory(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="history-pagination">
            <el-pagination
              @current-change="handleHistoryPageChange"
              :current-page="historyPage"
              :page-size="historyPageSize"
              layout="total, prev, pager, next"
              background
              :total="historyTotal"
            />
          </div>
        </div>
      </el-dialog>
      
      <!-- 待审核申请模态框 -->
      <el-dialog
        title="待审核申请"
        v-model="waitVisible"
        width="800px"
        :close-on-click-modal="false"
      >
        <div class="wait-list">
          <el-table :data="waitList" style="width: 100%">
            <el-table-column prop="url" label="直播链接">
              <template #default="{row}">
                <a :href="row.url" target="_blank" class="live-url">{{ row.url }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="直播平台" width="120" />
            <el-table-column prop="applyTime" label="申请时间" width="180" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="{row}">
                <el-button type="primary" size="small" @click="handleAudit(row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="wait-pagination">
            <el-pagination
              @current-change="handleWaitPageChange"
              :current-page="waitPage"
              :page-size="waitPageSize"
              layout="total, prev, pager, next"
              background
              :total="waitTotal"
            />
          </div>
        </div>
      </el-dialog>
      
      <!-- 审核理由模态框 -->
      <el-dialog
        title="审核申请"
        v-model="auditVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form :model="auditForm" :rules="auditRules" label-width="80px">
          <el-form-item label="审核理由" prop="reason">
            <el-input 
              v-model="auditForm.reason" 
              type="textarea"
              rows="4"
              placeholder="请输入审核理由（2-100字）"
              maxlength="100"
              show-word-limit
            />
            
          </el-form-item>
          <el-form-item label="审核理由" prop="playUid">
            <el-input 
                v-model="auditForm.playUid" 
                placeholder="请输入直播间ID（拒绝可不输入）"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="danger" @click="handleAuditAction(false)">拒绝</el-button>
            <el-button type="success" @click="handleAuditAction(true)">通过</el-button>
          </span>
        </template>
      </el-dialog>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import McBtn from '../../components/McBtn.vue'
import Empty from '../../components/FitEmpty.vue'

import useUserStore from '@/stores/user'
import { onMounted, ref } from 'vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { findAdvertisementByPosition,adPictureApi, getLiveRoomInfo, getLiveUserInfo, findAllLive, publicLiveApply, findAllLiveApplyOnAudit, deleteLive, updateLiveStatus } from '@/api/home'
import { findAllLiveByUser } from '../../api/home'

const router = useRouter()
const userStroe = useUserStore()
const loading = ref(true)
const liveData = ref([])
const liveTotal = ref(0)
const ads = ref([])
const isAdLoading = ref(true)
const init = ()=>{
  getLive()
  findAdvertisementByPosition("live")
  .then(res=>{
    let data = res.data.object
    if(res.data.msg == "SUCCESS"){
      ads.value = data
    }
    else{
      ElMessage.error("获取广告失败")
    }
    isAdLoading.value = false
  })
  .catch(e=>{
    ElMessage.error("获取广告失败")
    isAdLoading.value = false
  })
  
}

const applyVisible = ref(false)
const historyVisible = ref(false)
const waitVisible = ref(false)
const appendLive = (isApply) => {
  if(userStroe.isLogin){
    if(isApply){
      applyVisible.value = true
    }
    else{
      historyVisible.value = true
      getHistoryList()
    }
  }
  else{
    ElMessage.warning('请先登录')
    router.push('/login')
  }
}

const handleWaitList = () => {
  if(userStroe.isLogin){
    waitVisible.value = true
    getWaitList()
  }
  else{
    ElMessage.warning('请先登录')
    router.push('/login')
  }
}

const applyForm = ref({
  url: '',
  platform: 'bilibili'
})

const rules = {
  url: [
    { required: true, message: '请输入直播链接', trigger: 'blur' },
    { max: 150, message: '链接长度不能超过150个字符', trigger: 'blur' }
  ],
  platform: [
    { required: true, message: '请选择直播平台', trigger: 'change' }
  ]
}

const submitForm = async () => {
  let loading = ElLoading.service({
      lock: true,
      text: '提交中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  await publicLiveApply(applyForm.value.url,applyForm.value.platform)
  .then(res=>{
    if(res.data.msg == "SUCCESS"){
      ElMessage.success("申请提交成功")
      applyForm.value = {
        url: '',
        platform: 'bilibili'
      }
      applyVisible.value = false
    }
    else if(res.data.msg == 'LIVE_APPLY_EXIST'){
      ElMessage.error("申请已存在或其他人已申请")
    }
    else if(res.data.msg == 'LIVE_APPLY_DAY_MAX'){
      ElMessage.error("今日申请次数已达上限")
    }
    else{
      ElMessage.error("申请提交失败")
    }
  })
  .catch(e=>{
    ElMessage.error("申请提交失败")
  })
  loading.close()
}

// 历史申请相关
const historyList = ref([])
const historyTotal = ref(0)
const historyPage = ref(1)
const historyPageSize = ref(10)

// 待审核申请相关
const waitList = ref([])
const waitTotal = ref(0)
const waitPage = ref(1)
const waitPageSize = ref(10)
const auditVisible = ref(false)
const currentAuditItem = ref(null)
const auditForm = ref({
  reason: '',
  action: ''
})

const auditRules = {
  reason: [
    { required: true, message: '请输入审核理由', trigger: 'blur' },
    { min: 2, message: '理由长度不能少于2个字符', trigger: 'blur' },
    { max: 100, message: '理由长度不能超过100个字符', trigger: 'blur' }
  ],
  playUid: [
    { max: 50, message: '直播间ID长度不能超过50个字符', trigger: 'blur' }
  ]
}

const getHistoryList = async () => {
  await findAllLiveByUser(historyPage.value)
  .then(res=>{
    if(res.data.msg == "SUCCESS"){
      console.log(res.data.object)
      historyList.value = res.data.object
      historyTotal.value = res.data.num
    }
    else{
      ElMessage.error("获取历史申请失败")
    }
  })
  .catch(e=>{
    ElMessage.error("获取历史申请失败")
  })
}

const handleHistoryPageChange = (page) => {
  historyPage.value = page
  getHistoryList()
}

const getStatusText = (status) => {
  switch(status){
    case 1:
      return '通过'
    case -1:
      return '拒绝'
    case 0:
      return '待审核'
    default:
      return status
  }
}

const handleDeleteHistory = async (item) => {
  ElMessageBox.confirm('确定删除该申请吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    let loading = ElLoading.service({
      lock: true,
      text: '删除中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteLive(item.id)
    .then(res=>{
      if(res.data.msg == "SUCCESS"){
        ElMessage.success("删除成功")
        getHistoryList()
      }
      else if(res.data.msg == "LIVE_NOT_FOUND"){
        ElMessage.error("申请不存在")
      }
      else if(res.data.msg == "PERMISSION_DENIED"){
        ElMessage.error("你不能删除这个")
      }
      else{
        ElMessage.error("删除失败")
      }
    })
    .catch(e=>{
      ElMessage.error("删除失败")
    })
    loading.close()
  })
}

// 待审核申请相关方法
const getWaitList = async () => {
  await findAllLiveApplyOnAudit(waitPage.value)
  .then(res=>{
    if(res.data.msg == "SUCCESS"){
      waitList.value = res.data.object
      waitTotal.value = res.data.num
    }
    else{
      ElMessage.error("获取待审核申请失败")
    }
  })
  .catch(e=>{
    ElMessage.error("获取待审核申请失败")
  })

}

const handleWaitPageChange = (page) => {
  waitPage.value = page
  getWaitList()
}

const handleAudit = (item) => {
  currentAuditItem.value = item
  auditVisible.value = true
  auditForm.value = {
    reason: '',
    action: ''
  }
}

const handleAuditAction = async (action) => {
  if (!auditForm.value.reason) {
    ElMessage.warning('请输入审核理由')
    return
  }
  else if(action && !auditForm.value.playUid){
    ElMessage.warning('请输入直播间ID')
    return
  }
  if(!auditForm.value.playUid){
    auditForm.value.playUid = ""
  }
  let loading = ElLoading.service({
      lock: true,
      text: '修改中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  await updateLiveStatus(currentAuditItem.value.id,auditForm.value.playUid,auditForm.value.reason,action)
  .then(res=>{
    if(res.data.msg == "SUCCESS"){
      ElMessage.success(`审核${action ? '通过' : '拒绝'}成功`)
      auditVisible.value = false
      getWaitList()
    }
    else{
      ElMessage.error(`审核${action ? '通过' : '拒绝'}失败`)
    }
  })
  .catch(e=>{
    ElMessage.error(`审核${action ? '通过' : '拒绝'}失败`)
  })
  loading.close()
}



const goToLive = (id) => {
  window.open("https://live.bilibili.com/"+id, '_blank')
}

const goToSpace = (uid) => {
  window.open("https://space.bilibili.com/"+uid, '_blank')
}

const loadLiveTitle = async (playUuid,index) =>{
  await getLiveRoomInfo(playUuid)
  .then(async res=>{
    if(res.data.msg == "ok"){
          let dataRoom = res.data.data
          liveData.value[index].title = dataRoom.title
          liveData.value[index].live_status = dataRoom.live_status
          liveData.value[index].viewers = dataRoom.online
          liveData.value[index].uid = dataRoom.uid
          await getLiveUserInfo(dataRoom.uid)
          .then(res=>{
            if(res.data.msg == "success"){
              let dataUser = res.data.data
              liveData.value[index].username =dataUser[dataRoom.uid].uname
              liveData.value[index].avatar =dataUser[dataRoom.uid].face
            }
            else{
              console.log(res)
            }
          })
        }
    else{
      console.log(res)
    }
  })
}
const page = ref(1)
const changePage = (e) => {
  page.value = e
  getLive()
}
const getLive = async () => {
  await findAllLive(liveData.value.length,selectVersion.value)
  .then(res=>{
    if(res.data.msg == "SUCCESS"){
      let data = res.data.object
      liveData.value = res.data.object
      liveTotal.value = res.data.num
      for(let i = 0;i<data.length;i++){
        loadLiveTitle(data[i].playUuid,i)
      }
    }
    else{
      ElMessage.error("获取直播列表失败")
    }
  })
}

const topicVersion = 
["bilibili"]
const selectVersion = ref('bilibili')
onMounted(init)
</script>
<style scoped>
.ad {
  position: relative;
  border: 5px solid #131313;
}
.opearte {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-buttons {
  display: flex;
  align-items: center;
}

.pageOperate {
  display: flex;
  justify-content: end;
}
.live-item {
  border: 2px solid #a58960;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}
.live-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;
  border-bottom: 1px solid #a58960;
}

.live-info {
  flex: 1;
  padding-left: 5px;
}

.live-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.live-username {
  font-size: 14px;
  color: #666;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  width: 100%;
}

.live-avatar {
  margin-right: 10px;
}
.live-avatar img{
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: 1px solid #a58960;
  image-rendering: auto;
}
.live-avatar img:hover{
  cursor: pointer;
}
.live-username span{
  transition: color 0.3s ease;
}
.live-username span:hover{
  cursor: pointer;
  color: rgb(221, 145, 157);
}
.live-actions {
  margin-left: 10px;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.live-status {
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.live-viewers {
  margin-left: 8px;
  color: #0c8520;
  font-weight: 500;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-indicator.live {
  background-color: #f56c6c;
  animation: pulse_live 2s infinite;
}

.status-indicator.offline {
  background-color: #909399;
}
.status-indicator.play {
  animation: pulse_play 2s infinite;
  background-color: darkgreen;
}

@keyframes pulse_live {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}
@keyframes pulse_play {
  0% {
    box-shadow: 0 0 0 0 rgb(101, 199, 101);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}
.live-content {
  width: 100%;
  display: flex;
  justify-content: center;
}
.live-content iframe {
  width: 100%;
  border: none;
}

.live-url {
  color: var(--el-color-primary);
  text-decoration: none;
}

.live-url:hover {
  text-decoration: underline;
}

.history-list {
  max-height: 500px;
  overflow: auto;
}

.history-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.wait-list {
  max-height: 500px;
  overflow: auto;
}

.wait-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
