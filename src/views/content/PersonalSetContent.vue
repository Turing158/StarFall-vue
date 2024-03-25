<template>
  <Book>
    <Empty :height="30" />
    <div class="setHead">
      <img class="avatar" :src="'/src/assets/avatar/'+userStore.avatar" alt="" />
      <McBtn text="保存头像" />
    </div>
    <div class="setInfo">
      <table>
        <tr>
          <td>昵称 :</td>
          <td><el-input v-model="name" /></td>
        </tr>
        <tr>
          <td>性别 :</td>
          <td>
            <el-select placeholder="请选择性别" v-model="gender">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </td>
        </tr>
        <tr>
          <td>生日 :</td>
          <td><el-date-picker v-model="birthday" type="date" placeholder="请选择出生日期" /></td>
        </tr>
        <tr>
          <td>验证码:</td>
          <td>
            <el-input placeholder="请输入验证码" style="width: 140px" />
            <img class="code" :src="codeImg" alt="" @click="changeCode()" />
          </td>
        </tr>
      </table>
    </div>
    <Empty :height="20" />
    <div class="operate">
      <McBtn text="重置" :margin="10" @click="reset()"/>
      <McBtn text="保存" :margin="10" @click="onSaveInfo()"/>
    </div>
  </Book>
</template>
<script setup>
import { ref } from 'vue'
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
import useUserStore from '@/stores/user'
import { ElMessage, ElNotification } from 'element-plus'
import { saveInfo } from '@/api/user'
let date = new Date()
const codeImg = ref('http://localhost:8080/getCodeImage?r' + date.getTime())
const changeCode = () => {
  codeImg.value = 'http://localhost:8080/getCodeImage?r' + new Date().getTime()
}
const options = [
  {
    value: '0',
    label: '隐藏'
  },
  {
    value: '1',
    label: '男'
  },
  {
    value: '2',
    label: '女'
  },
  {
    value: '3',
    label: '沃尔玛购物袋'
  }
]
const userStore = useUserStore()
const name = ref(userStore.name)
const gender = ref('')
const checkGender = ()=>{
  if (userStore.gender == 0) {
    gender.value = '隐藏'
  } else if (userStore.gender == 1) {
    gender.value = '男'
  } else if (userStore.gender == 2) {
    gender.value = '女'
  } else if (userStore.gender == 3) {
    gender.value = '沃尔玛购物袋'
  }
}
checkGender()
const birthday = ref(userStore.birthday)
const onSaveInfo = async()=>{
  if(
    name.value == userStore.name &&
    gender.value == userStore.gender &&
    birthday.value == userStore.birthday
  ){
    ElNotification({
      title:'保存成功',
      message: '已将用户信息保存',
      type:'success'
    })
  }
  else{
    await saveInfo(userStore.user,name.value,gender.value,birthday.value).then(res=>{
      let msg = res.data.msg
      if(msg == "CODE_ERROR"){
        ElMessage.error('验证码错误')
      }
      else{
        ElNotification({
          title:'保存成功',
          message: '已将用户信息保存',
          type:'success'
        })
      }
    }).catch(err=>{
      ElMessage.error('服务异常')
    })
  }
}
const reset = ()=>{
  name.value = userStore.name
  gender.value = userStore.gender
  birthday.value = userStore.birthday
  checkGender()
}
</script>
<style scoped>
.setHead {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 100px;
  height: 100px;
  margin: 10px;
  background-color: aliceblue;
}
.setInfo {
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
