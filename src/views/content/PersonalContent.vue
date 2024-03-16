<template>
  <div>
    <Empty :height="20" />
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
      <TopicList :isNull="data == null || data.length == 0">
        <TopicItem v-for="(item,index) in data" :key="index" :item="item" :isEdit="true"/>
      </TopicList>
    </div>
  </div>
</template>
<script setup>
import ExpBar from '../../components/ExpBar.vue'
import Empty from '../../components/FitEmpty.vue'
import TopicList from '@/components/TopicList.vue';
import TopicItem from '@/components/TopicItem.vue';
const data = []
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
</style>
