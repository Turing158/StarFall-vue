<template>
  <div>
    <Book>
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
      <TopicList :isNull="data == null || data.length == 0">
        <TopicItem v-for="(item, index) in data" :key="index" :item="item" :onClickTitle="clickTopic(item)" :onClickAuthor="clickAuthor(item)"/>
      </TopicList>
      <Empty :height="10" />
      <div class="pageOperate">
        <el-pagination
          class="custom"
          layout="prev, pager, next"
          :total="100"
          :page-size="20"
          :background="true"
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
import router from '@/router/index.js'
import { ref } from 'vue'
const data = ref([])
const appendTopic = ()=>{
  
}
for (let i=0;i<20;i++) {
  data.value.push({
    label: '视频',
    title: '震惊！竟有一人在路上走路',
    author: '某人',
    date: '2022-02-14',
    viewNum: 10,
    commentNum: 20
  })
}
const clickTopic = (i)=>{
  router.push("/topic/detail")
}
const clickAuthor = (i)=>{

}
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
