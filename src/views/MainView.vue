<template>
  <div class="main">
    <router-view/>
    <div class="bottom"></div>
    <el-backtop>
      <div class="backTop">
        <img style="width: 100%;" src="../assets/img/icon/arrow.png" alt="">
      </div>
    </el-backtop>
  </div>
</template>
<script setup>
import useUserStore from '@/stores/user'
import { initWebSocket } from '@/util/handleNotice'
import { ElLoading, ElNotification } from 'element-plus'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const userStroe = useUserStore()
const router = useRouter()
router.beforeResolve((to,from,next)=>{
  if(
    to.path == '/personal'||
    to.path == '/personal/setting'||
    to.path == '/personal/password'||
    to.path == '/personal/email'||
    to.path == '/signIn'||
    to.path == '/notices'
    ){
    if(userStroe.user != '' || userStroe.isLogin){
      next()
    }
    else{
      ElNotification({
        title:'未登录',
        message:'暂未登录，无法访问此页面，已跳转到登录界面',
        type:'warning'
      })
      router.push('/login')
    }
  }
  else{
    next()
  }
  if(to.path == '/topic/editTopic'){
    if(userStroe.level < 5){
      router.push('/topic')
      ElNotification({
        title:'等级不足',
        message:'等级不足，无法访问此页面',
        type:'warning'
      })
      
    }
    else{
      next()
    }
  }
  if(to.path == '/login' || to.path == '/reg' || to.path == '/forget'){
    if(userStroe.isLogin){
      ElNotification({
        title:'已登录',
        message:'已经登录，可以愉快的玩耍，如要更换账号，请退出登录更换',
        type:'warning'
      })
      router.push(from.path)
    }
  }
})

const init = ()=>{
  initWebSocket()
}

onMounted(init)
</script>
<style scoped>
.main {
  overflow-x: hidden;
}
.backTop{
  height: 100%;
  width: 100%;
  background-color: #e3c99e;
  box-shadow: var(--el-box-shadow-lighter);
  border-radius: 10px
}
.bottom {
  position: relative;
  width: 100vw;
  height: 50px;
  background-image: url(../assets/img/tail.png);
  background-size: 2%;
  z-index: 1;
}
</style>
