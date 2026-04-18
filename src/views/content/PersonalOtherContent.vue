<template>
  <Book>
    <Empty :height="30" />
    <div class="basicInfo">
      <div class="avatarOut">
        <img class="avatar" :src="getAvatarSrc(userInfo.avatar)" alt="" width="100%" height="100%"/>
      </div>
      <div class="info">
        <div class="exp">
          <ExpBar :lv="userInfo.level" :exp="userInfo.exp" :maxExp="userInfo.maxExp" />
        </div>
        <div class="infomation">
          <span
            >{{ userInfo.name }} <span class="user">({{ userInfo.user }})[{{ userInfo.role=='admin'?'管理员':userInfo.role=='moderator'?'版主':'普通用户'}}]</span></span><br />
          <div class="personInfo">
            <span class="birth">
              出生日期：{{ userInfo.birthday }}<span :class="userInfo.showBirthday == 1 ? '' : 'hide'">{{ userInfo.showBirthday == 1 ? userInfo.birthday : '2002-02-02' }}</span>
            </span>

            <span class="email" >
              邮箱：<span :class="userInfo.showEmail == 1 ? '' : 'hide'">{{ userInfo.showEmail == 1 ? userInfo.email : '12345@example.com' }}</span>
            </span>
            
            <span class="gender">
              性别：<span :class="userInfo.showGender == 1 ? '' : 'hide'">{{ userInfo.showGender == 1 ? userInfo.gender : '男女都不是' }}</span>
            </span>

            <span class="onlineName">
              正版ID：<span :class="userInfo.showOnlineName == 1 ? '' : 'hide'">{{ userInfo.showOnlineName == 1 ? userInfo.onlineName : 'Minecraft' }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="medal-container">
        <div class="medal-item" 
        v-for="(item, index) in medals.slice(0, 10) " 
        :key="index" 
        :title="`${item.description}\n获得: ${item.gainTime}${item.expireTime ? `\n过期: ${item.expireTime}` : ''}`"
        @click="goToMedal(item.id)">
          <img class="medal-img" :src="`/img${item.icon}`" alt="" />
          <div class="medal-name">{{ item.name }}</div>
        </div>
      </div>
      <div class="add-friend-btn" v-if="userStore.user">
        <McBtn text="添加好友" @click="addFriend"/>
      </div>
    </div>
    <div class="signature">
      <div class="signature-title">
        <div class="title-cell">个</div>
        <div class="title-cell">人</div>
        <div class="title-cell">签</div>
        <div class="title-cell">名</div>
      </div>
      <div class="signature-container">
        <PersonSignature :data="userInfo.signature" />
      </div>
    </div>
    <div class="viewContainer">
      <div class="viewOperate">
        <McBtn text="他的主题" @click="changeTab(true)"/>
        <McBtn text="他的收藏" @click="changeTab(false)" :disabled="userInfo.showCollection == 0 || !userStore.user"/>
      </div>
      <div class="topicView">
        <div class="topic" v-if="isTopic">
          <TopicList
            :isNull="topicData == null || topicData.length == 0"
            v-loading="topicLoading"
            :loading="topicLoading"
            element-loading-background="#11111100"
            element-loading-text="加载中..."
          >
            <TopicItem v-for="(item, index) in topicData" :key="index" :item="item" />
          </TopicList>
          <Empty :height="10" />
          <div class="pageOperate">
            <el-pagination
              class="custom"
              layout="prev, pager, next"
              :total="topicTotal"
              :page-size="20"
              :background="true"
              @current-change="changePage"
            />
          </div>
        </div>
        <div class="topic" v-if="!isTopic">
          <TopicList
            :isNull="collectionData == null || collectionData.length == 0"
            v-loading="collectionLoading"
            :loading="collectionLoading"
            element-loading-background="#11111100"
            element-loading-text="加载中..."
          >
            <TopicItem v-for="(item, index) in collectionData" :key="index" :item="item" />
          </TopicList>
          <Empty :height="10" />
          <div class="pageOperate">
            <el-pagination
              class="custom"
              layout="prev, pager, next"
              :total="collectionTotal"
              :page-size="20"
              :background="true"
              @current-change="changeCollectionPage"
            />
          </div>
        </div>
      </div>
    </div>
  </Book>
</template>
<script setup>
import ExpBar from '../../components/ExpBar.vue'
import Empty from '../../components/FitEmpty.vue'
import TopicList from '@/components/TopicList.vue'
import TopicItem from '@/components/TopicItem.vue'
import { findUserinfo, getAvatarSrc, getMedalOnPerson } from '@/api/user'
import Book from '@/components/Book.vue'
import { onMounted, reactive, ref } from 'vue'
import { findAllTopicByUser } from '@/api/topic'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute,useRouter } from 'vue-router'
import McBtn from '@/components/McBtn.vue'
import { applyFriend } from '@/api/friend'
import PersonSignature from '@/components/PersonSignature.vue'
import useUserStore from '@/stores/user'
import { findAllUserCollection } from '../../api/topic'
const topicLoading = ref(true)
const collectionLoading = ref(true)
const route = useRoute()
const userStore = useUserStore()
const userInfo = ref({})
const gender = ref('')
const checkGender = (e)=>{
  if (e == 0) {
    userInfo.value.gender = '隐藏'
  } else if (e == 1) {
    userInfo.value.gender = '男'
  } else if (e == 2) {
    userInfo.value.gender = '女'
  } else if (e == 3) {
    userInfo.value.gender = '沃尔玛购物袋'
  }
}
const isTopic = ref(true)
const changeTab = (e) => {
  isTopic.value = e
  if(e){
    getTopic()
  }
  else{
    getCollection()
  }
}
const topicData = ref([])
const topicTotal = ref(0)
const topicPage = ref(1)
const changePage = (e) => {
  topicPage.value = e
  getTopic()
}
const getTopic = async () => {
  await findAllTopicByUser(topicPage.value, userInfo.value.user)
    .then((res) => {
      let data = res.data.object
      let num = res.data.num

      topicData.value = data
      topicTotal.value = num
      topicLoading.value = false
    })
    .catch((err) => {
      ElMessage.error('获取主题列表失败')
      topicLoading.value = false
    })
}
const collectionData = ref([])
const collectionTotal = ref(0)
const collectionPage = ref(1)
const changeCollectionPage = (e) => {
  collectionPage.value = e
  getCollection()
}
const getCollection = async () => {
  await findAllUserCollection(collectionPage.value, userInfo.value.user)
    .then((res) => {
      let data = res.data.object
      let num = res.data.num

      if(res.data.msg == "SUCCESS"){
        collectionData.value = data
        collectionTotal.value = num
      }
      else if(res.data.msg == "DISABLED_SHOW"){
        ElMessage.error('该用户不给看收藏主题')
      }
      else if(res.data.msg == "NOT_LOGIN"){
        ElMessage.error('请先登录')
      }
      else{
        ElMessage.error('获取收藏列表失败')
      }
      
    })
    .catch((err) => {
      ElMessage.error('获取收藏列表失败')
    })
    collectionLoading.value = false
}
const getUserInfo = async()=>{
  await findUserinfo(route.params.user).then(res=>{
    let msg = res.data.msg
    if(msg == 'USER_ERROR'){
      ElMessage.error('用户不存在')
    }
    else{
      let data = res.data.object
      userInfo.value = data
      checkGender(data.gender)
      getTopic()
    }
    
  }).catch(err=>{
    ElMessage.error('获取用户信息失败')
  })
}
const addFriend = () => {
  if(!userStore.user){
    ElMessage.error('请先登录')
    return
  }
  ElMessageBox.prompt('请输入添加好友的原因', '添加好友', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '',
    beforeClose: async(action, instance, done) =>{
        if(action == 'cancel'){
          done()
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
        await applyFriend(userInfo.value.user,reason)
        .then(res=>{
          let msg = res.data.msg
          if(msg == 'SUCCESS'){
            ElMessage.success('好友申请已发送')
            isSuccess = true
          }
          else if(msg == 'SUCCESS_ADD'){
            ElMessage.error('成功添加好友')
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
  })
}
const medals = ref([])
const getMedel = async() =>{
  await getMedalOnPerson(route.params.user)
    .then(res=>{
      medals.value = res.data.object
    })
    .catch(err=>{
      ElMessage.error('获取勋章失败')
    })
}

const router = useRouter()
const goToMedal = (medalId) =>{
  if(!userStore.user){
    ElMessage.error('请先登录')
    return
  }
  router.push({
    path: '/medals' + (medalId ? `/${medalId}` : '')
  })
}
onMounted(()=>{
  getUserInfo()
  getMedel()
})
</script>
<style scoped>
.basicInfo {
  height: 115px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
}
.avatarOut {
  width: 80px;
  height: 80px;
  padding: 5px;
  background-color: #f1f1f1;
  margin: 0 10px;
}
.info {
  width: 450px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
}
.exp {
  width: 400px;
  height: 30px;
}
.infomation {
  margin: 0px 10px;
  font-size: 15px;
}
.user {
  font-size: 12px;
}
.user:hover {
  text-decoration: underline;
}
.personInfo{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
.birth,.gender,.email,.onlineName {
  font-size: 12px;
}
.add-friend-btn {
  position: absolute;
  top: 0px;
  right: 10px;
}
.topic {
  position: relative;
  padding: 10px 0;
}
.pageOperate {
  display: flex;
  justify-content: end;
}
.signature{
  display: flex;
}
.signature-title{
  font-size: 15px;
  font-weight: bold;
  margin: 0 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 5px;
  width: 80px;
  height: 80px;
  border-right: 1px solid #a58960;
  padding: 10px 20px;
}
.title-cell{
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1e6d6;
  border: 1px solid #a58960;
  border-radius: 4px;
  font-size: 20px;
  transition: all 0.2s ease-in-out;
}
.title-cell:hover{
  background-color: #e6d4b6;
}
.signature-container{
  width: 780px;
  border: 1px solid #a5896000;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}
.signature-container:hover{
  border: 1px solid #a58960;
}
.hide {
  position: relative;
  padding: 2px 5px;
}
.hide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fbf2db6e;
  backdrop-filter: blur(3px);
  border-radius: 4px;
  pointer-events: none;
}
.medal-container{
  width: 400px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 5px;
  z-index: 1;
}
.medal-item{
  width: 70px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #a58960;
  overflow: hidden;
  cursor: pointer;
  font-size: 14px;
}
.medal-item span{
  width: 70px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}
.medal-img{
  width: 70px;
  height: 40px;
  image-rendering: auto;
  object-fit: cover;
  background-color: #ffffff;
  z-index: -1;
}
.medal-name{
  position: absolute;
  width: 70px;
  height: 40px;
  border-radius: 8px;
  background-color: #fbf2dba1;
  font-size: 14px;
  font-weight: bold;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  transform: translateY(5px);
}
.medal-item:hover .medal-name{
  opacity: 1;
  transform: translateY(0);
}
.medal-item:hover span{
  background-color: #ebe0c6;
}
.viewContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.viewOperate {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 10px;
}
.topicView {
  width: 100%;
}
</style>
