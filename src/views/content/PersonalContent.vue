<template>
  <Book ref="bookOut">
    <Empty :height="30" />
    <div class="basicInfo">
      <div class="headOut">
        <img class="head" src="" alt="" />
      </div>
      <div class="info">
        <div class="exp">
          <ExpBar :lv="userStore.level" :exp="userStore.exp" :maxExp="userStore.maxExp" />
        </div>
        <div class="infomation">
          <span>{{ userStore.name }} <span class="user">({{ userStore.user }})</span></span
          ><br />
          <span class="birth">出生日期：{{ userStore.birthday }}</span><br />
          <span class="gender">性别：{{ gender }}</span>
        </div>
      </div>
    </div>
    <div class="topic">
      <TopicList :isNull="topicData == null || topicData.length == 0" :isEdit="true">
        <TopicItem v-for="(item, index) in topicData" :key="index" :item="item" :isEdit="true"/>
      </TopicList>
      <Empty :height="10" />
      <div class="pageOperate">
        <el-pagination
          class="custom"
          layout="prev, pager, next"
          :total="20"
          :page-size="10"
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
import {useUserStore} from '@/stores/user'
import Book from '@/components/Book.vue'
import { onMounted, ref } from 'vue'
import { findAllTopicByUser } from '@/api/topic'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const bookOut = ref()
const gender = ref('')
if(userStore.gender == 0){
  gender.value = '隐藏'
}
else if(userStore.gender == 1){
  gender.value = '男'
}
else if(userStore.gender == 2){
  gender.value = '女'
}
else if(userStore.gender == 3){
  gender.value = '沃尔玛购物袋'
}
const topicData = ref([])
const topicTotal = ref()
const page = ref(1)
const changePage = (e)=>{
  page.value = e
  getTopic()
}
const getTopic = async() =>{
  await findAllTopicByUser(page.value,userStore.user).then(res=>{
    let data = res.data.object
    let num = res.data.num
    topicData.value = data
    topicTotal.value = num
  }).catch(err=>{
    console.log(err);
    ElMessage.error('获取主题列表失败')
  })
  bookOut.value.setHeight()
}
const clickTopic = (i)=>{

}
const clickAuthor = (i)=>{
  
}
const clickEdit = (i)=>{

}
const clickDel = (i)=>{

}
onMounted(getTopic)
</script>
<style scoped>
.basicInfo {
  height: 100px;
  padding: 10px;
  display: flex;
  flex-direction: row;
}
.headOut {
  width: 80px;
  height: 80px;
  padding: 5px;
  background-color: #f1f1f1;
  margin: 0 10px;
}
.info {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
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
.birth {
  font-size: 12px;
}
.gender {
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
</style>
