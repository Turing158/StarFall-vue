<template>
  <Book>
    <Empty :height="30" />
    <div class="basicInfo">
      <div class="avatarOut">
        <img class="avatar" :src="userStore.avatar" alt="" width="100%" height="100%"/>
      </div>
    
      <div class="info">
        <div class="exp">
          <ExpBar :lv="userStore.level" :exp="userStore.exp" :maxExp="userStore.maxExp" />
        </div>
        <div class="infomation">
          <span
            >{{ userStore.name }} <span class="user">({{ userStore.user }})[{{ userStore.role=='admin'?'管理员':userStore.role=='moderator'?'版主':'普通用户'}}]</span></span><br />
          <div class="personInfo">

            <span class="birth">
              出生日期：{{ userStore.birthday }}
              <span style="position: relative; top: 3px;">
                <ShowEye :size="15" v-if="personalized.showBirthday == 1"/>
                <HideEye :size="15" v-else />
              </span>
            </span>

            <span class="email">
              邮箱：{{ userStore.email }}
              <span style="position: relative; top: 3px;">
                <ShowEye :size="15" v-if="personalized.showEmail == 1"/>
                <HideEye :size="15" v-else />
              </span>
            </span>
            
            <span class="gender">
              性别：{{ gender }}
              <span style="position: relative; top: 3px;">
                <ShowEye :size="15" v-if="personalized.showGender == 1"/>
                <HideEye :size="15" v-else />
              </span>
            </span>

            <span class="onlineName" v-if="personalized.onlineName">
              正版ID：{{ personalized.onlineName }}
              <span style="position: relative; top: 3px;">
                <ShowEye :size="15" v-if="personalized.showOnlineName == 1"/>
                <HideEye :size="15" v-else />
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="medal-container">
        <div class="medal-item" 
        v-for="(item, index) in medals.length > 10 
        ? medals.slice(0, 9) 
        : medals" 
        :key="index" 
        :title="`${item.description}\n获得: ${item.gainTime}${item.expireTime ? `\n过期: ${item.expireTime}` : ''}`"
        @click="goToMedal(item.id)">
          <img class="medal-img" :src="`/src/assets/img${item.icon}`" alt="" />
          <div class="medal-name">{{ item.name }}</div>
        </div>
        <div class="medal-item" @click="goToMedal" v-if="medals.length > 10">
          <span>更多...</span>
        </div>
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
        <PersonSignature :data="personalized.signature" />
      </div>
    </div>
    <div class="topic">
      <TopicList
        :isNull="topicData == null || topicData.length == 0"
        :isEdit="true"
        v-loading="loading"
        :loading="loading"
        element-loading-background="#11111100"
        element-loading-text="加载中..."
      >
        <TopicItem v-for="(item, index) in topicData" :key="index" :item="item" :isEdit="true" />
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
  </Book>
</template>
<script setup>
import ExpBar from '../../components/ExpBar.vue'
import Empty from '../../components/FitEmpty.vue'
import TopicList from '@/components/TopicList.vue'
import TopicItem from '@/components/TopicItem.vue'
import { useUserStore } from '@/stores/user'
import { getAvatarApi, getMedalOnPerson, getSelfPersonalized } from '@/api/user'
import PersonSignature from '@/components/PersonSignature.vue'
import Book from '@/components/Book.vue'
import { onMounted, ref } from 'vue'
import { findAllTopicByUser } from '@/api/topic'
import HideEye from '@/components/HideEye.vue'
import ShowEye from '@/components/ShowEye.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const loading = ref(true)
const userStore = useUserStore()
const router = useRouter()
const gender = ref('')
if (userStore.gender == 0) {
  gender.value = '隐藏'
} else if (userStore.gender == 1) {
  gender.value = '男'
} else if (userStore.gender == 2) {
  gender.value = '女'
} else if (userStore.gender == 3) {
  gender.value = '沃尔玛购物袋'
}
const personalized = ref({})
const getPersonalized = async() =>{
  await getSelfPersonalized()
  .then(res=>{

    personalized.value = res.data.object
  })
  .catch(err=>{
    ElMessage.error('获取个人化设置失败')
  })
}
const topicData = ref([])
const topicTotal = ref(0)
const page = ref(1)
const changePage = (e) => {
  page.value = e
  getTopic()
}
const getTopic = async () => {
  await findAllTopicByUser(page.value, userStore.user)
    .then((res) => {
      let data = res.data.object
      let num = res.data.num
      topicData.value = data
      topicTotal.value = num
      loading.value = false
    })
    .catch((err) => {
      ElMessage.error('获取主题列表失败')
      loading.value = false
    })
}
const medals = ref([])
const getMedel = async() =>{
  await getMedalOnPerson(userStore.user)
    .then(res=>{
      medals.value = res.data.object
    })
    .catch(err=>{
      ElMessage.error('获取勋章失败')
    })
}
const goToMedal = (medalId) =>{
  router.push({
    path: '/medals' + (medalId ? `/${medalId}` : '')
  })
}

onMounted(()=>{
  getTopic()
  getPersonalized()
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
.infomation {
  margin: 0px 10px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
