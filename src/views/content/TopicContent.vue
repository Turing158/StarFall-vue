<template>
  <div>
    <Book ref="bookOut">
      <div class="opearte">
        <McBtn text="发 布" @click="appendTopic()" />
      </div>
      <Empty :height="10" />
      <div class="ad">
        <el-carousel trigger="click">
          <el-carousel-item>
            <img src="../../assets/img/ad/1.jpg" alt="" width="100%" />
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/img/ad/2.png" alt="" width="100%" />
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/img/ad/3.png" alt="" width="100%" />
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/img/ad/4.png" alt="" width="100%" />
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/img/ad/5.png" alt="" width="100%" />
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/img/ad/6.png" alt="" width="100%" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <Empty :height="10" />
      <div>
        标签:
        <el-select style="width: 150px; margin-right: 10px" v-model="selectLabel" @change="getTopic">
          <el-option v-for="item in topicLabel" :key="item" :label="item" :value="item" />
        </el-select>
        版本:
        <el-select style="width: 150px; margin-right: 10px" v-model="selectVersion" @change="getTopic">
          <el-option v-for="item in topicVersion" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <Empty :height="10" />
      <TopicList
        :isNull="topicData == null || topicData.length == 0"
        v-loading="loading"
        :loading="loading"
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
          :page-size="10"
          :background="true"
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
import { findAllTopic, findTopicVersion } from '@/api/topic'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
const loading = ref(true)
const bookOut = ref()
const topicData = ref([])
const topicTotal = ref(0)
const appendTopic = () => {}
const page = ref(1)
const changePage = (e) => {
  page.value = e
  console.log(page.value)
  getTopic()
}
const getTopic = async () => {
  await findAllTopic(page.value,selectLabel.value,selectVersion.value)
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

  bookOut.value.setHeight()
}
const topicLabel = ['无', '服务端', '客户端', '模组', '插件', '材质包', '视频']
const selectLabel = ref('无')
const topicVersion = ref([])
const getTopicVersion = async () => {
  await findTopicVersion()
    .then((res) => {
      let data = res.data.object
      topicVersion.value = data
    })
    .catch((err) => {
      ElMessage.error('获取版本失败')
    })
}
getTopicVersion()
const selectVersion = ref('无')
onMounted(getTopic)
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
