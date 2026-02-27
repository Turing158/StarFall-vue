<template>
    <Book>
    <Empty :height="30" />
    <div class="topic">
      <TopicList
        :isNull="topicData == null || topicData.length == 0"
        v-loading="loading"
        :loading="loading"
        element-loading-background="#11111100"
        element-loading-text="加载中..."
      >
        <TopicItem v-for="(item, index) in topicData" :key="index" :item="item"/>
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
import Empty from '../../components/FitEmpty.vue'
import TopicList from '@/components/TopicList.vue'
import TopicItem from '@/components/TopicItem.vue'
import Book from '@/components/Book.vue'
import { onMounted, ref } from 'vue'
import { findAllCollection } from '@/api/topic'
import { ElMessage } from 'element-plus'
const loading = ref(true)
const topicData = ref([])
const topicTotal = ref(0)
const page = ref(1)
const changePage = (e) => {
  page.value = e
  getTopic()
}
const getTopic = async () => {
  await findAllCollection(page.value)
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
onMounted(getTopic)

</script>
<style scoped>
.topic {
  position: relative;
  padding: 10px 0;
}
.pageOperate {
  display: flex;
  justify-content: end;
}
</style>