<template>
  <Book>
    <Empty :height="50" />
    <div class="content" v-on:keydown.enter="confirm()">
      <table>
        <tr>
          <td>旧密码&emsp;:</td>
          <td>
            <el-input
              type="password"
              placeholder="请输入旧密码"
              v-model="oldPassword"
              show-password
              maxlength="25"
            />
          </td>
        </tr>
        <tr>
          <td>新密码&emsp;:</td>
          <td>
            <el-input
              placeholder="请输入新密码"
              v-model="newPassword"
              show-password
              maxlength="25"
            />
          </td>
        </tr>
        <tr>
          <td>再次输入:</td>
          <td>
            <el-input
              placeholder="请再次输入新密码"
              v-model="againPassword"
              show-password
              maxlength="25"
            />
          </td>
        </tr>
        <tr>
          <td>验证码&emsp;:</td>
          <td>
            <el-input placeholder="请输入验证码" style="width: 110px" v-model="code" />
            <img class="code" :src="codeImg" alt="" @click="changeCode()" />
          </td>
        </tr>
      </table>
    </div>
    <Empty :height="20" />
    <div class="operate">
      <McBtn text="修改" :margin="10" @click="confirm()" />
    </div>
  </Book>
</template>
<script setup>
import { settingPassword } from '@/api/user'
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
import useUserStore from '@/stores/user'
import { ElMessage, ElNotification } from 'element-plus'
import { ref } from 'vue'

let date = new Date()
const codeImg = ref('http://localhost:8080/getCodeImage?r' + date.getTime())
const changeCode = () => {
  codeImg.value = 'http://localhost:8080/getCodeImage?r' + new Date().getTime()
}
const oldPassword = ref('')
const newPassword = ref('')
const againPassword = ref('')
const code = ref('')
const userStroe = useUserStore()

const confirm = async () => {
  if (newPassword.value.length < 6) {
    ElMessage.error('新密码小于6位')
  } else if (newPassword.value == oldPassword.value) {
    ElMessage.error('新密码不能与新密码相同')
  } else if (newPassword.value != againPassword.value) {
    ElMessage.error('新密码与再次输入的密码不同')
  } else {
    await settingPassword(userStroe.user, oldPassword.value, newPassword.value, code.value)
      .then((res) => {
        let msg = res.data.msg
        if (msg == 'CODE_ERROR') {
          ElMessage.error('验证码错误')
        } 
        else if (msg == 'PASSWORD_ERROR') {
          ElMessage.error('旧密码错误')
        }
        else{
          ElNotification({
            title:'修改成功',
            message:'成功修改密码，下次登录记得注意',
            type:'success'
          })
          oldPassword.value = ''
          newPassword.value = ''
          againPassword.value = ''
        }
      })
      .catch((err) => {
        ElMessage.error('服务异常')
      })
      code.value = ''
    changeCode()
  }
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
