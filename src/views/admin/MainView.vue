<template>
    <div class="main" :style="{backgroundColor:isDark ? '#55504a' : '#faedca'}">
        <el-menu
        :default-active="page"
        router
        :background-color="isDark ? '#99876c' : '#fbf2db'"
        :text-color="isDark ? '#fff' : '#333'"
        class="dark menu"
        :unique-opened="true"
      >
      <el-menu-item index="/admin">
        <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/admin/ad">
          <span>公屏广告</span>
        </el-menu-item>
        <el-menu-item index="/admin/hometalk">
          <span>每日一言</span>
        </el-menu-item>
        <el-menu-item index="/admin/live">
          <span>直播申请</span>
        </el-menu-item>
        <el-menu-item index="/admin/notice">
          <span>公告列表</span>
        </el-menu-item>
        <el-sub-menu>
          <template #title>
            <span>主题管理</span>
          </template>
          <el-menu-item index="/admin/topic">
            <span>主题列表</span>
            </el-menu-item>
            <el-menu-item index="/admin/topic/comment">
            <span>评论管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/topic/like">
            <span>喜爱管理</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/admin/user">
          <template #title>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/admin/user">
            <span>用户信息</span>
          </el-menu-item>
          <el-menu-item index="/admin/personalized">
            <span>个性管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/friend">
            <span>好友管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/user/medal">
            <span>勋章管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin/signIn">
          <span>签到管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/chat">
          <span>聊天管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/medal">
          <span>勋章管理</span>
        </el-menu-item>
        <el-menu-item index="/">
          <span>返回主页</span>
        </el-menu-item>
        <div class="changeTheme">
          <div class="title" :style="{color:isDark ? '#f1f1f1' : '#333'}">{{ isDark ? 'Dark' : 'Light' }}</div>
          <el-switch v-model="isDark" @change="changeTheme" class="switch" :style="{'--el-color-white':isDark?'#55504a':'#fbf2db'}">
            <template #active-action>
              <span>🌙</span>
            </template>
            <template #inactive-action>
              <span style="color: chocolate;">☀</span>
            </template>
          </el-switch>
        </div>
      </el-menu>
      <div class="content" :style="{backgroundColor:isDark ? '#99876c' : '#fbf2db',color: isDark ? '#fbf2db' : '#99876c'}">
        <router-view/>
      </div>
    </div>
</template>
<script setup>
import { hasPermission } from '@/api/user';
import {House} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()
const page = ref(router.currentRoute.value.path)
const isDark = ref(false)
const changeTheme = (e) => {
  isDark.value = e
  localStorage.setItem('isDark', isDark.value)
}
if(localStorage.getItem('isDark') == 'true'){
  isDark.value = true
}
provide('isDark', isDark)
const init = async()=>{
  await hasPermission().then(res=>{
    let msg = res.data.msg
    if(msg == 'SUCCESS'){
      console.log("管理员权限验证成功")
    }
    else{
      router.push('/')
    }
  }).catch(err=>{
    router.push('/')
    ElMessage.error("服务异常")
  })
}
onMounted(init)
</script>
<style scoped>
*{
  transition: all 0.25s;
}
.main{
    width: 100vw;
    height: 100vh;
    background: none;
    background-color: #f1f1f1;
    display: flex;
}
.menu{

}
.content{
  width: calc(100vw - 140px);
  height: calc(100vh - 20px);
  margin: 10px;
  background-color: #fefefe;
  border-radius: 10px;
  overflow: auto;
}
.changeTheme{
  position: absolute;
  bottom: 0px;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
.changeTheme .title{
  font-size: 15px;
  font-weight: bold;
  color: #333;
}
.switch{
  --el-switch-off-color: #e29b00;
  --el-switch-on-color: rgb(24, 69, 138);
}
</style>
