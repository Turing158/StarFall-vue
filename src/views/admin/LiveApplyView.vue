<template>
  <div class="live-apply" :class="isDark ? 'dark' : ''">
    <h2>直播申请管理</h2>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="onPage(null)" plain>添加</el-button>
      <span style="position: relative; font-size: 12px; float: right; top: 20px; right: 50px"
        >tips: 点击操作按钮进行审核</span
      >
    </div>
    <el-table :data="liveApplies" :class="isDark ? 'dark' : ''">
      <el-table-column label="ID" prop="id" width="150" />
      <el-table-column label="申请人" prop="user" width="180" >
        <template #default="{ row }">
          {{ row.name }}({{ row.user }})
        </template>
      </el-table-column>
      <el-table-column label="直播平台" prop="platform" width="120">
        <template #default="{ row }">
          {{ row.platform }}
        </template>
      </el-table-column>
      <el-table-column label="直播链接" prop="url" width="300">
        <template #default="{ row }">
          <a :href="row.url" target="_blank" class="live-url">{{ row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="申请理由" prop="reason" width="300"/>
      <el-table-column label="审核人" prop="operator" width="180" >
        <template #default="{ row }">
          <span v-if="row.operator">
            {{ row.operatorName }}({{ row.operator }})
          </span>
          <span v-else>
            <el-tag type="danger">无审核员</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="播放UUID" prop="playUuid" width="150" />
      <el-table-column label="申请时间" prop="applyTime" width="180" />
      <el-table-column label="状态" prop="status" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : row.status === -1 ? 'danger' : 'warning'">
            {{ row.status === 1 ? '可观看' : row.status === -1 ? '未通过' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="250" align="center" fixed="right">
        <template #header>
          <el-input v-model="keyword" size="small" placeholder="搜索申请人或标题" @input="search" />
        </template>
        <template #default="{ row }">
          <el-button v-if="row.status === 1 && row.playUuid" type="info" plain @click="viewLive(row)">查看</el-button>
          <el-button type="primary" plain @click="onPage(row)">编辑</el-button>
          <el-button type="danger" plain @click="onDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :class="isDark? 'dark':''"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="10"
        layout="total, prev, pager, next"
        background
        :total="total"
      />
    </div>
    <el-dialog
      :class="isDark ? 'dark' : ''"
      :title="dialogTitle"
      v-model="infoPage"
      width="600"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form ref="formInput" inline :rules="rules" :model="liveApply">
        <el-form-item label="申请人" prop="user">
          <el-select
            v-model="liveApply.user"
            style="width: 185px;"
            placeholder="请输入用户"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodUser">
            <el-option
              v-for="item in userSelect"
              :key="item.user"
              :label="item.user"
              :value="item.user"
            >
              <span style="float: left">{{ item.user }}</span>
              <span
                style="position: relative;right: -25px;float: right; color: var(--el-text-color-secondary); font-size: 12px"
              >{{ item.name }}</span>
            </el-option>
            <div v-if="userLoading" class="loading-indicator">
              加载中...
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="直播平台" prop="platform">
          <el-select v-model="liveApply.platform" style="width: 185px" placeholder="选择直播平台">
            <el-option label="Bilibili" value="Bilibili" />
          </el-select>
        </el-form-item>
        <el-form-item label="直播链接" prop="url">
          <el-input v-model="liveApply.url" style="width: 380px" placeholder="请输入直播链接" />
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input v-model="liveApply.reason" style="width: 380px" placeholder="请输入申请理由" />
        </el-form-item>
        <el-form-item label="审核人" prop="operator">
          <el-select
            v-model="liveApply.operator"
            style="width: 185px;"
            placeholder="请输入审核人"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodOperator">
            <el-option
              v-for="item in operatorSelect"
              :key="item.user"
              :label="item.user"
              :value="item.user"
            >
              <span style="float: left">{{ item.user }}</span>
              <span
                style="position: relative;right: -25px;float: right; color: var(--el-text-color-secondary); font-size: 12px"
              >{{ item.name }}</span>
            </el-option>
            <div v-if="operatorLoading" class="loading-indicator">
              加载中...
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="播放UUID" prop="playUuid">
          <el-input v-model="liveApply.playUuid" style="width: 380px" placeholder="请输入播放UUID" />
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="liveApply.status" style="width: 185px" placeholder="选择状态">
            <el-option label="待审核" :value="0" />
            <el-option label="可观看" :value="1" />
            <el-option label="未通过" :value="-1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="infoPage = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看直播模态框 -->
    <el-dialog
      :class="isDark ? 'dark' : ''"
      title="查看直播"
      v-model="viewLiveVisible"
      width="60%"
      :close-on-click-modal="true"
      :show-close="true"
    >
      <div v-if="currentLiveItem" class="live-item">
        <div class="live-header">
          <div class="live-info">
            <div class="live-title">{{ currentLiveItem.title || "标题加载中..." }}</div>
            <div class="live-username">
              <div class="live-avatar">
                <img :src="currentLiveItem.avatar"
                 @click="goToSpace(currentLiveItem.uid)"
                 referrerpolicy="no-referrer" alt="主播头像" />
              </div>
              <span @click="goToSpace(currentLiveItem.uid)">{{ currentLiveItem.username ? currentLiveItem.username : "主播加载中..." }}</span>
            </div>
          </div>
          <div class="live-actions">
            <el-button type="primary" plain @click="goToLive(currentLiveItem.url)">前往直播间</el-button>
            <div class="live-status">
              <span :class="['status-indicator', currentLiveItem.live_status == 1 ? 'live' : currentLiveItem.live_status == 2 ? 'play' : 'offline']"></span>
              <span>{{ currentLiveItem.live_status == 1 ? '直播中' : currentLiveItem.live_status == 2 ? '未开播,轮播中' : '未开播'}}</span>
              <span v-if="currentLiveItem.live_status == 1" class="live-viewers">
                {{ currentLiveItem.viewers ? currentLiveItem.viewers+' 人看过' : '加载中...' }} 
              </span>
            </div>
          </div>
        </div>
        <div class="live-content">
          <iframe class="live-iframe" 
                  style="width: 100%; height: 600px;" 
                  :src="'https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=' + currentLiveItem.playUuid + '&quality=0'" 
                  frameborder="no" 
                  framespacing="0" 
                  scrolling="no" 
                  allow="encrypted-media" 
                  allowfullscreen="true"
          ></iframe>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteLive, findAllLive } from '@/api/admin/home'
import { findAllUsersForSelect } from '@/api/admin/user'
import { getLiveRoomInfo, getLiveUserInfo } from '@/api/home'
import { appendLiveApply, updateLiveApply } from '../../api/admin/home'

const isDark = inject('isDark')

const liveApplies = ref([])
const total = ref(0)
const page = ref(1)
const keyword = ref('')
const infoPage = ref(false)
const dialogTitle = ref('')
const model = ref('')

const liveApply = ref({
  id: '',
  user: '',
  url: '',
  reason: '',
  operator: '',
  platform: '',
  playUuid: '',
  applyTime: '',
  status: 0
})

// 查看直播相关
const viewLiveVisible = ref(false)
const currentLiveItem = ref(null)

// 用户选择相关
const userSelect = ref([]) // 用户选择列表
const operatorSelect = ref([]) // 审核人选择列表
const userLoading = ref(false)
const operatorLoading = ref(false)

const rules = {
  user: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  platform: [{ required: true, message: '请选择直播平台', trigger: 'change' }],
  url: [{ required: true, message: '请输入直播链接', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const init = () => {
  getLiveApplies()
}

const getLiveApplies = async () => {
  await findAllLive(page.value)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      liveApplies.value = res.data.object
      total.value = res.data.num
    }
  })
}

const search = () => {
  // 这里应该根据keyword过滤数据
  console.log('搜索:', keyword.value)
}

const handleCurrentChange = (val) => {
  page.value = val
  getLiveApplies()
}

const onPage = (row) => {
  if (row) {
    liveApply.value = { ...row }
    dialogTitle.value = '编辑直播申请'
    model.value = 'edit'
  } else {
    liveApply.value = {
      id: '',
      user: '',
      url: '',
      reason: '',
      operator: '',
      platform: '',
      playUuid: '',
      applyTime: new Date().toLocaleString(),
      status: 0
    }
    dialogTitle.value = '添加直播申请'
    model.value = 'add'
  }
  infoPage.value = true
}

const save = async () => {
  console.log(liveApply.value);
  if(model.value == 'add'){
    await appendLiveApply(liveApply.value).then(res=>{
      if(res.data.msg == 'SUCCESS'){
        ElMessage.success('成功添加')
        infoPage.value = false
        getLiveApplies()
      }
      else{
        ElMessage.error('添加失败')
      }
    })
    .catch(err=>{
      console.log(err);
      ElMessage.error('服务异常');
    })
  }else{
    await updateLiveApply(liveApply.value).then(res=>{
      if(res.data.msg == 'SUCCESS'){
        ElMessage.success('成功修改')
        infoPage.value = false
        getLiveApplies()
      }
      else{
        ElMessage.error('修改失败')
      }
    })
    .catch(err=>{
      console.log(err);
      ElMessage.error('服务异常');
    })
  }
  
  infoPage.value = false
  getLiveApplies()
}

const onDel = async (row) => {
  ElMessageBox.confirm('确定要删除这条直播申请吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    await deleteLive(row.id).then(res=>{
      if(res.data.msg == 'SUCCESS'){
        getLiveApplies()
        ElMessage.success('删除成功')
      }
      else{
        ElMessage.error('删除失败')
      }
    })
    .catch(err=>{
      console.log(err);
      ElMessage.error('服务异常');
    })
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}



const remoteMethodUser = async(queryString)=>{
  if (!queryString) {
    userSelect.value = [];
    return;
  }
  userLoading.value = true;
  await findAllUsersForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      userSelect.value = res.data.object || [];
    } else {
      ElMessage.error('获取用户列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
  .finally(() => {
    userLoading.value = false;
  });
}

const remoteMethodOperator = async(queryString)=>{
  if (!queryString) {
    operatorSelect.value = [];
    return;
  }
  operatorLoading.value = true;
  await findAllUsersForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      operatorSelect.value = res.data.object || [];
    } else {
      ElMessage.error('获取用户列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
  .finally(() => {
    operatorLoading.value = false;
  });
}

const viewLive = (row) => {
  currentLiveItem.value = row
  console.log(row)
  loadLiveTitle(row.playUuid)
  viewLiveVisible.value = true
}

const goToLive = (url) => {
  window.open(url, '_blank')
}

// 监听模态框关闭，清除数据
watch(() => viewLiveVisible.value, (newVal) => {
  if (!newVal) {
    currentLiveItem.value = null
  }
})

const goToSpace = (uid) => {
  window.open("https://space.bilibili.com/"+uid, '_blank')
}

const loadLiveTitle = async (playUuid) =>{
  await getLiveRoomInfo(playUuid)
  .then(async res=>{
    if(res.data.msg == "ok"){
          let dataRoom = res.data.data
          console.log(dataRoom)
          currentLiveItem.value.title = dataRoom.title
          currentLiveItem.value.live_status = dataRoom.live_status
          currentLiveItem.value.viewers = dataRoom.online
          currentLiveItem.value.uid = dataRoom.uid
          await getLiveUserInfo(dataRoom.uid)
          .then(res=>{
            if(res.data.msg == "success"){
              let dataUser = res.data.data
              console.log(dataUser)
              currentLiveItem.value.username =dataUser[dataRoom.uid].uname
              currentLiveItem.value.avatar =dataUser[dataRoom.uid].face
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

onMounted(init)
</script>

<style>
.live-apply {
  padding: 20px;
  min-height: 80vh;
}

.live-apply h2 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.page {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.live-url {
  color: var(--el-color-primary);
  text-decoration: none;
}

.live-url:hover {
  text-decoration: underline;
}

/* 加载指示器样式 */
.loading-indicator {
  text-align: center;
  padding: 10px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

/* 直播查看样式 */
.live-item {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.live-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid var(--el-border-color);
  background-color: #ac8d66;
}

.live-info {
  flex: 1;
}

.live-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}

.live-username {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  color: #666;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  width: 100%;
  
}
.live-username span{
  cursor: pointer;
}
.live-avatar {
  margin-right: 10px;
  cursor: pointer;
}
.live-avatar img{
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: 1px solid #a58960;
  image-rendering: auto;
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
  padding: 20px;
  background-color: #ac8d66;
}

.live-iframe {
  border-radius: 4px;
}

</style>