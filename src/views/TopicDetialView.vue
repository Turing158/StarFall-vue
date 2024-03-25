<template>
  <div class="topicDetail">
    <Ul class="ul" style="position: fixed"></Ul>
    <div class="contentOut">
      <Book ref="bookOut">
        <div v-if="!error">
          <TopicDetailContent :data="topicInfo" />
        </div>
        <div class="error" v-if="error">
          <div>此主题不存在或已被删除-><span @click="router.back()">点此返回</span></div>
        </div>
      </Book>
    </div>
  </div>
</template>
<script setup>
import Ul from '../components/UlBar.vue'
import Book from '../components/Book.vue'
import TopicDetailContent from './content/TopicDetailContent.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getTopicInfo } from '@/api/topic'
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
const bookOut = ref()
const topicInfo = ref()
const error = ref(true)
const init = async () => {
  await getTopicInfo(route.params.id)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'ID_ERROR') {
        ElMessage.error('此主题帖已被删除或不存在')
      } else {
        let data = res.data.object
        topicInfo.value = data
        error.value = false
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
  bookOut.value.setHeight()
}
onMounted(init)
</script>
<style scoped>
.ul {
  top: 0;
}
.contentOut {
  min-height: calc(100vh - 230px);
  margin: 50px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.error span {
  cursor: pointer;
}
.error span:hover {
  text-decoration: underline;
}
</style>
