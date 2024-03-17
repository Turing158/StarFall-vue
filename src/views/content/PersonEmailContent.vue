<template>
  <Book>
    <Empty :height="50" />
    <div class="emailInfo">当前邮箱：{{ email }}</div>
    <Empty :height="20" />
    <div class="change">
      <table>
        <tr>
          <td>新邮箱：</td>
          <td colspan="2"><el-input placeholder="请输入新邮箱" style="width: 190px" /></td>
        </tr>
        <tr>
          <td>验证码：</td>
          <td><el-input placeholder="请输入验证码" style="width: 120px" /></td>
          <td><McBtn text="获取" /></td>
        </tr>
      </table>
    </div>
  </Book>
</template>
<script setup>
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
import { ref } from 'vue'
const email = ref('123@163.com')
const changeEmail = () => {}
</script>
<style scoped>
.emailInfo,
.change {
  display: flex;
  justify-content: center;
}
.emailInfo {
  line-height: 30px;
}
</style>
