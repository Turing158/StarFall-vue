<template>
  <Book>
    <Empty :height="50" />
    <div class="content">
      <table>
        <tr>
          <td>旧密码:</td>
          <td><el-input placeholder="请输入旧密码" /></td>
        </tr>
        <tr>
          <td>新密码:</td>
          <td><el-input placeholder="请输入新密码" /></td>
        </tr>
        <tr>
          <td>再次输入:</td>
          <td><el-input placeholder="请再次输入新密码" /></td>
        </tr>
        <tr>
          <td>验证码:</td>
          <td>
            <el-input placeholder="请输入验证码" style="width: 110px" />
            <img class="code" :src="codeImg" alt="" @click="changeCode()"/>
          </td>
        </tr>
      </table>
    </div>
    <Empty :height="20" />
    <div class="operate">
      <McBtn text="修改" :margin="10" /> 
    </div>
  </Book>
</template>
<script setup>
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
import { ref } from 'vue';
let date = new Date()
const codeImg = ref('http://localhost:8080/getCodeImage?r' + date.getTime())
const changeCode = () => {
  codeImg.value = 'http://localhost:8080/getCodeImage?r' + new Date().getTime()
}
</script>
<style scoped>
.content {
  display: flex;
  justify-content: center;
}
.operate {
  display: flex;
  justify-content: center;
}
.code {
  position: absolute;
  width: 75px;
  height: 30px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
