<template>
  <div class="main">
    <router-view/>
    
    <el-backtop>
      <div class="backTop">
        <img style="width: 100%;" src="../assets/img/icon/arrow.png" alt="">
      </div>
    </el-backtop>
  </div>
</template>
<script setup>
import useUserStore from '@/stores/user'
import { ElMessage, ElNotification } from 'element-plus'
import { onMounted, provide, ref } from 'vue'
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
    to.path == '/notices'||
    to.path == '/admin'

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
  if(to.path == '/login' || to.path == '/reg'){
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
const onOpen = (e) => {
  console.log('WebSocket连接成功')
}
const onError = (e) => {
  ElMessage.error('服务异常')
  console.log('onError', e)
}
const onSend = (e) => {
  console.log('onSend', e)
}
const onMessage = (e) => {
  let data = JSON.parse(e.data)
  console.log(data);
  ElNotification({
        title:'新消息-来自'+data.fromUser+'的消息',
        message:data.content,
        type:'success'
      })
}
const onClose = (e) => {
  console.log('WebSocket关闭')
}
const webSocket = ref()
const init = ()=>{
  let url = 'ws://localhost:8080/message/'+userStroe.token
  if(userStroe.isLogin){
    webSocket.value = new WebSocket(url)
    webSocket.value.onopen = onOpen
    webSocket.value.onerror = onError
    webSocket.value.onmessage = onMessage
    webSocket.value.onclose = onClose
    webSocket.value.send = onSend
    
  }
}
provide('webSocket',webSocket)
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

</style>
