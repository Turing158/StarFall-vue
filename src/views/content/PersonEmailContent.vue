<template>
  <Book>
    <Empty :height="50" />
    <div class="emailInfo">当前邮箱：{{ userStore.email }}</div>
    <Empty :height="20" />
    <div class="change">
      <table>
        <tr>
          <td>验证码：</td>
          <td><el-input placeholder="请输入旧邮箱验证码" style="width: 120px" v-model="oldCode"/></td>
          <td><div @click="onGetOldEmailCode()"><McBtn text="获取"/></div></td>
        </tr>
        <tr>
          <td>新邮箱：</td>
          <td colspan="2"><el-input placeholder="请输入新邮箱" style="width: 190px" v-model="newEmail"/></td>
        </tr>
        <tr>
          <td>验证码：</td>
          <td><el-input placeholder="请输入新邮箱验证码" style="width: 120px" v-model="newCode"/></td>
          <td><div @click="onGetNewEmailCode()"><McBtn text="获取" /></div></td>
        </tr>
        <tr>
          <td colspan="3"></td>
          
        </tr>
        <tr>
          <td></td>
          <td><div @click="changeEmail()"><McBtn text="确认修改"/></div></td>
          <td></td>
        </tr>
      </table>
    </div>
  </Book>
</template>
<script setup>
import { getNewEmailCode, getOldEmailCode, updateEmail } from '@/api/user'
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
import useUserStore from '@/stores/user'
import { ElMessage } from 'element-plus'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const oldCode = ref('')
const newEmail = ref('')
const newCode = ref('')
const onGetOldEmailCode = async() => {
  await getOldEmailCode().then(res => {
    if(res.data.msg === "SUCCESS"){
      ElMessage.success('验证码发送成功')
    }
    else{
      ElMessage.error('验证码发送失败')
    }
  }).catch(err => {
    ElMessage.error('验证码发送失败')
  })
}
const onGetNewEmailCode = async() => {
  if(newEmail.value.length == 0){
    ElMessage.error('请输入新邮箱')
  }
  else{
    await getNewEmailCode(newEmail.value).then(res => {
      if(res.data.msg === "SUCCESS"){
        ElMessage.success('验证码发送成功')
      }
      else{
        ElMessage.error('验证码发送失败')
      }
    }).catch(err => {
      ElMessage.error('服务异常')
    })
  }
}
const router = useRouter()
const changeEmail = async() => {
  if(oldCode.value.length === 0){
    ElMessage.error('请输入旧邮箱验证码')
  }
  else if(newEmail.value.length === 0){
    ElMessage.error('请输入新邮箱')
  }
  else if(newCode.value.length === 0){
    ElMessage.error('请输入新邮箱验证码')
  }
  else{
    await updateEmail(oldCode.value, newEmail.value, newCode.value).then(res => {
      console.log(res);
      let msg = res.data.msg
      if(msg === "SUCCESS"){
        let data = res.data.object
        ElMessage.success('修改成功')
        userStore.setEmail(newEmail.value)
        userStore.setToken(data)
        router.go(0)
      }
      else if(msg == 'OLD_EMAIL_CODE_EXPIRED'){
        ElMessage.error('旧邮箱验证码已过期或不存在')
      }
      else if(msg == 'NEW_EMAIL_CODE_EXPIRED'){
        ElMessage.error('新邮箱验证码已过期或不存在')
      }
      else if(msg === "OLD_EMAIL_CODE_ERROR"){
        ElMessage.error('旧邮箱验证码错误')
      }
      else if(msg === "NEW_EMAIL_CODE_ERROR"){
        ElMessage.error('新邮箱验证码错误')
      }
      else if(msg === "EMAIL_ERROR"){
        ElMessage.error('邮箱已存在')
      }
      else{
        ElMessage.error('修改失败')
      }
    }).catch(err => {
      ElMessage.error('服务异常')
    })
  }
}
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
