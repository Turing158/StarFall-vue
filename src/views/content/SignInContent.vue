<template>
  <div>
    <Book>
      <div class="content">
        <div class="left">
          <div class="headOut"></div>
          <div class="info">
            <span class="date">0000-00-00</span>
            <span>今天暂未签到</span>
            <span>已连续签到n天</span>
          </div>
          <div class="sign"><McBtn text="签 到" /><McBtn text="已 签 到" /></div>
        </div>
        <div class="right">
          <el-table :data="data" style="background-color: transparent;">
            <el-table-column prop="date" label="日期" />
            <el-table-column prop="msg" label="消息" />
            <el-table-column prop="mood" label="心情" />
          </el-table>
        </div>
      </div>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import McBtn from '@/components/McBtn.vue'
import { ref } from 'vue'
const data = ref([
  {
    date: '2024-10-10',
    msg: '666',
    mood: '好'
  }
])
</script>
<style scoped>
.content {
  display: flex;
}
.left {
  width: 200px;
  min-height: 300px;
  background-color: #f3debf;
  border: 1px solid #a58960;
  margin-right: 20px;
}
.headOut {
  margin: 30px 20px;
  width: 160px;
  height: 160px;
  background-color: #f1f1f1;
}
.info {
  border-top: 1px solid #a58960;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
}
.date {
  font-size: 15px;
}
.sign {
  border-top: 1px solid #a58960;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right {
  width: calc(100% - 240px);
  min-height: 300px;
  background-color: #f3debf;
  border: 1px solid #a58960;
}
</style>
