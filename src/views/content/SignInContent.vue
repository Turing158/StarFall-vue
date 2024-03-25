<template>
  <div>
    <Book>
      <div class="content">
        <div class="left">
          <div class="avatarOut">
            <img :src="userStore.avatar" alt="">
          </div>
          <div class="info">
            <span class="date">{{ date }}</span>
            <span v-show="!isSignIn">今天暂未签到</span>
            <span v-show="isSignIn">已连续签到n天</span>
          </div>
          <div class="sign">
            <div v-show="!isSignIn">
              <McBtn text="签 到" />
            </div>
            <div v-show="isSignIn">
              <McBtn text="已 签 到" />
            </div>
          </div>
        </div>
        <div class="right">
          <el-table :data="data" empty-text="未找到签到记录">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="msg" label="消息" />
            <el-table-column prop="mood" label="心情" width="60" align="center" />
          </el-table>
          <Empty height="20" />
          <div class="operate">
            <el-pagination
              :total="100"
              :page-count="10"
              background="true"
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import McBtn from '@/components/McBtn.vue'
import Empty from '@/components/FitEmpty.vue'
import { ref } from 'vue'
import useUserStore from '@/stores/user'
const data = ref([
  {
    date: '2024-10-10',
    msg: '666',
    mood: '好'
  }
])
const isSignIn = ref(false)
let dateUtil = new Date()
const date = ref(
  dateUtil.getFullYear() + '-' + (dateUtil.getMonth() + 1) + '-' + dateUtil.getDate()
)
const userStore = useUserStore()
</script>
<style scoped>
.content {
  display: flex;
}
.left {
  width: 200px;
  min-height: 300px;
  background-color: #f7e9d4;
  border: 1px solid #a58960;
  margin-right: 20px;
}
.avatarOut {
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
.operate {
  display: flex;
  justify-content: end;
  padding: 0 10px;
}
</style>
