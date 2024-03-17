<template>
  <Book>
    <Empty :height="30" />
    <div class="basicInfo">
      <div class="headOut">
        <img class="head" src="" alt="" />
      </div>
      <div class="info">
        <div class="exp">
          <ExpBar :lv="3" :exp="33" :maxExp="200" />
        </div>
        <div class="infomation">
          <span>name <span class="user">(user)</span></span
          ><br />
          <span class="birth">出生日期：0000-00-00</span><br />
          <span class="gender">性别：男</span>
        </div>
      </div>
    </div>
    <div class="topic">
      <TopicList :isNull="data == null || data.length == 0" :isEdit="true">
        <TopicItem v-for="(item, index) in data" :key="index" :item="item" :isEdit="true" />
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
    </div>
  </Book>
</template>
<script setup>
import ExpBar from '../../components/ExpBar.vue'
import Empty from '../../components/FitEmpty.vue'
import TopicList from '@/components/TopicList.vue'
import TopicItem from '@/components/TopicItem.vue'
import Book from '@/components/Book.vue'
import { ref } from 'vue'
const data = ref([])
for (let i = 0; i < 20; i++) {
  data.value.push({
    label: '视频',
    title: '震惊！竟有一人在路上走路',
    author: '某人',
    date: '2022-02-14',
    viewNum: 10,
    commentNum: 20
  })
}
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
