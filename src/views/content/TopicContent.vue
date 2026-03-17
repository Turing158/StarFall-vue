<!-- 主题列表页面（这里是资源列表） -->
<template>
  <div>
    <Book>
      <div class="opearte">
        <div><McBtn text="发 布" @click="appendTopic()"/></div>
      </div>
      <Empty :height="10" />
      <div class="ad">
        <el-carousel trigger="click" 
            v-loading="isAdLoading" 
            element-loading-background="#fbf2db"
            element-loading-text="加载中...">
          <el-carousel-item v-for="(item,index) in ads" :key="index" label=" ">
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
        标签:
        <el-select style="width: 150px; margin-right: 10px" v-model="selectLabel" @change="onChangeLabel">
          <el-option v-for="item in topicLabel" :key="item" :label="item" :value="item" />
        </el-select>
        版本:
        <el-select style="width: 150px; margin-right: 10px" v-model="selectVersion" @change="onChangeLabel">
          <el-option v-for="item in topicVersion" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button v-if="selectLabel != '全部' || selectVersion != '全部'" type="warning" @click="onReset">重置</el-button>
      </div>
      <Empty :height="10" />
      <TopicList
        :isNull="topicData == null || topicData.length == 0"
        v-loading="loading"
        :loading="loading"
        :titleMaxWidth="'600px'"
        element-loading-background="#f3debf"
        element-loading-text="加载中..."
      >
        <TopicItem v-for="(item, index) in topicData" :key="index" :item="item" :labelClick="onClickLabel" />
      </TopicList>
      <Empty :height="10" />
      <div class="pageOperate">
        <el-pagination
          class="custom"
          layout="prev, pager, next"
          :total="topicTotal"
          :page-size="30"
          background
          @current-change="changePage"
        />
      </div>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import McBtn from '../../components/McBtn.vue'
import Empty from '../../components/FitEmpty.vue'
import TopicList from '../../components/TopicList.vue'
import TopicItem from '../../components/TopicItem.vue'
import { findAllTopic } from '@/api/topic'
import useUserStore from '@/stores/user'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { findAdvertisementByPosition,adPictureApi } from '@/api/home'

const router = useRouter()
const userStroe = useUserStore()
const loading = ref(true)
const topicData = ref([])
const topicTotal = ref(0)
const ads = ref([])
const isAdLoading = ref(true)
const init = ()=>{
  getTopic()
  findAdvertisementByPosition("resource")
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
const appendTopic = () => {
  if(userStroe.isLogin){
    router.push('/topic/resource')
  }
  else{
    ElMessage.warning('请先登录')
    router.push('/login')
  }
}
const page = ref(1)
const changePage = (e) => {
  page.value = e
  getTopic()
}
const getTopic = async () => {
  await findAllTopic(page.value,selectLabel.value,selectVersion.value,"resource")
    .then((res) => {
      loading.value = false
      let data = res.data.object
      let num = res.data.num
      topicData.value = data
      topicTotal.value = num
    })
    .catch((err) => {
      ElMessage.error('获取主题失败')
      loading.value = false
    })

}
const onClickLabel = (label) => {
  page.value = 1
  selectLabel.value = label
  getTopic()
}

const onChangeLabel = () => {
  page.value = 1
  getTopic()
}
const topicLabel = ['全部', '服务端', '客户端', '模组', '插件', '材质包', '地图', '光影', '皮肤','数据包']
const selectLabel = ref('全部')
const topicVersion = 
['全部', 
'1.4.x',
'1.5.x',
'1.6.x',
'1.7','1.7.2','1.7.10','1.7.x',
'1.8','1.8.9','1.8.x',
'1.9','1.9.4','1.9.x',
'1.10','1.10.2','1.10.x',
'1.11','1.11.2','1.11.x',
'1.12','1.12.2','1.12.x',
'1.13','1.13.1','1.13.x',
'1.14','1.14.2','1.14.4','1.14.x',
'1.15','1.15.2','1.15.x',
'1.16','1.16.5','1.16.x',
'1.17','1.17.1','1.17.x',
'1.18','1.18.2','1.18.x',
'1.19','1.19.4','1.19.x',
'1.20','1.20.1','1.20.2','1.20.6','1.20.x',
'1.21','1.21.1','1.21.2','1.21.3','1.21.4','1.21.8','1.21.x',
]
const selectVersion = ref('全部')
const onReset = () => {
  selectLabel.value = '全部'
  selectVersion.value = '全部'
  getTopic()
}
onMounted(init)
</script>
<style>
.ad {
  position: relative;
  border: 5px solid #131313;
}
.pageOperate {
  display: flex;
  justify-content: end;
}
</style>
