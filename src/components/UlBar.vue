<template>
  <ul id="ul">
    <minSearch></minSearch>
    <li class="ul_li" v-for="(item, index) in UlItem" :key="index">
      <router-link
        v-if="item.eName != 'blog' && flagShow(item)"
        :to="item.href"
        :class="PageIndex === index ? 'active' : 'ul_border'"
        @click="PageIndex = index"
      >
        <b>{{ item.name }}</b
        ><br /><span>{{ item.eName }}</span>
      </router-link>
      <a class="ul_border" :href="item.href" v-show="item.eName == 'blog'" target="_block">
        <b>{{ item.name }}</b
        ><br /><span>{{ item.eName }}</span>
      </a>
    </li>
    <div v-show="isLogin" class="user ul_border">
      <img :src="userStore.avatar" alt="" class="avatar_img" />
      <span class="username">{{ userStore.name }}</span>
      <div class="menu">
        <div class="challage">
          <div class="medal">勋章1</div>
          <div class="medal">勋章1</div>
          <div class="medal">勋章1</div>
        </div>
        <div class="exp">
          <ExpBar :lv="userStore.level" :exp="userStore.exp" :maxExp="userStore.maxExp" />
        </div>
        <div class="operate">
          <router-link class="ul_border" to="/personal">个人</router-link>
          <div class="notice">
            <router-link class="ul_border" to="/notices" @click="PageIndex = -1">消息</router-link>
            <span class="notice_num" v-show="userStore.unreadNum != 0" @click="toNotices">{{ handleNoticeNum(userStore.unreadNum) }}</span>
          </div>
          <router-link class="ul_border" to="/friends" @click="PageIndex = -1">好友</router-link>
          <a class="ul_border" @click="onExit()">退出</a>
        </div>
      </div>
    </div>
    <router-link to="/login">
      <div v-show="!isLogin" class="unuser ul_border">
        <span>请登录，谢谢</span>
        <br /><br />
        <span>Login</span>
      </div>
    </router-link>
  </ul>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import minSearch from './minSearch.vue'
import ExpBar from './ExpBar.vue'
const props = defineProps({
  pageIndex: {
    type: Number,
    default: -1
  }
})
const UlItem = ref([
  {
    name: '主页',
    eName: 'Home',
    href: '/',
    admin: false,
    needLogin: false
  },
  {
    name: '直播',
    eName: 'Live',
    href: '/live',
    admin: false,
    needLogin: false
  },
  {
    name: '资源',
    eName: 'Resource',
    href: '/resource',
    admin: false,
    needLogin: false
  },
  {
    name: '有话说',
    eName: 'Talk',
    href: '/talk',
    admin: false,
    needLogin: false
  },
  {
    name: '签到',
    eName: 'SignIn',
    href: '/signIn',
    admin: false,
    needLogin: true
  },
  {
    name: '管理',
    eName: 'Admin',
    href: '/admin',
    admin: true,
    needLogin: true
  }
])
const PageIndex = ref(props.pageIndex)

import useUserStore from '@/stores/user'
import { ElMessage, ElNotification } from 'element-plus'
import { exit } from '@/api/user'
import router from '@/router'
import { findLastNoticeAndUnreadNum } from '@/api/notice'
import { handleNotification, handleNoticeNum } from '../util/handleNotice'
const userStore = useUserStore()
const isLogin = ref(userStore.isLogin)
const flagShow = (item)=>{
  let flag = true
  if(item.needLogin){
    if(!userStore.isLogin){
      flag = false
    }
  }
  if(item.admin){
    if(userStore.role != 'admin'){
      flag = false
    }
  }
  return flag
}
const toNotices = () => {
  PageIndex.value = -1
  router.push('/notices')
}
const initNoticeNum = async ()=>{
  if(!userStore.isLogin){
      return
    }
  await findLastNoticeAndUnreadNum()
  .then(res=>{
    userStore.setUnreadNum(res.data.num)
    if(!router.currentRoute.value.path == '/notices'){
      handleNotification(res.data.object, true,res.data.num)
    }
  })
  .catch(e=>{
    ElMessage.error('服务异常')
  })
}
const onExit = async () => {
  await exit()
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'NO_TOKEN') {
        ElNotification({
          title: '退出登录',
          message: '嘿!你个老登,你还没登录呢',
          type: 'error'
        })
      } else {
        ElNotification({
          title: '退出登录',
          message: '成功退出登录，期待下次回来',
          type: 'success'
        })
        console.log("退出")
        router.push('/')
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
  userStore.exit()
  isLogin.value = false
}
onMounted(()=>{
  initNoticeNum()
})
</script>

<style scoped>
#ul {
  display: flex;
  width: 100vw;
  height: 55px;
  background-image: url(../assets/img/ul_bg.png);
  list-style: none;
  position: relative;
  justify-content: center;
  font-family: cool_font;
  font-weight: bold;
  box-shadow: 0px 1px 5px #131313;
  z-index: 999;
}
.ul_li {
  float: left;
  margin-left: 20px;
}
.ul_li a {
  position: relative;
  display: block;
  text-decoration: none;
  text-align: center;
  top: 2px;
  padding: 0px 25px;
  color: #f1f1f1;
  background-image: url(../assets/img/set/spruce.png);
  border-radius: 5px;
  background-size: 100%;
  transition: all 250ms;
}
.ul_li a:hover:not(.active) {
  color: #131313;
  background-image: url(../assets/img/set/oak.png);
  border-radius: 5px;
}
.ul_li a b,
.ul_li a span {
  position: relative;
  top: 0;
  transition: all 250ms;
}
.ul_li a:hover:not(.active) b {
  display: inline-block;
  top: 22px;
}
.ul_li a:hover:not(.active) span {
  display: inline-block;
  top: -22px;
}

.ul_li a.active {
  background-image: url(../assets/img/set/birch.png);
  color: #131313;
  border-radius: 5px;
  border-top: 2px solid #d4c599;
  border-left: 2px solid #d4c599;
  border-right: 2px solid #6e664f;
  border-bottom: 2px solid #6e664f;
}

.ul_li a.active b {
  display: inline-block;
  top: 22px;
}
.ul_li a.active span {
  display: inline-block;
  top: -22px;
}

ul form {
  float: right;
  right: 1px;
  border: 2px solid #f1f1f1;
  color: #f1f1f1;
  border-radius: 5px;
  text-align: center;
  width: 150px;
  height: 55px;
  line-height: 55px;
}
ul .avatar_img {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
  transition: all 250ms;
  image-rendering: auto;
  left: 0;
}

.user {
  position: absolute;
  float: right;
  right: 18px;
  border: 2px solid #f1f1f1;
  background-color: #fbf2db;
  color: #f1f1f1;
  border-radius: 10px;
  text-align: center;
  width: 50px;
  height: 50px;
  transition: all 250ms;
}

.user:hover {
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 200px;
}
.user .username{
  /* overflow: hidden; */
  position: absolute;
  left: 65px;
  width: 50px;
  height: 50px;
  opacity: 0;
  color: #574832;
  text-overflow: ellipsis;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.user:hover .username{
  width: 120px;
  opacity: 1;
}

.menu {
  position: relative;
  background-image: url(../assets/img/set/birch.png);
  background-size: 100%;
  border-radius: 0px 0px 5px 5px;
  width: 200px;
  height: 0px;
  top: 0px;
  opacity: 0;
  color: #131313;
  box-shadow: 0px 4px 4px rgb(0, 0, 0);
  border-top: 0;
  z-index: -1;
  border-left: 2px solid #8f8568;
  border-right: 2px solid #3f3a2c;
  border-bottom: 2px solid #3f3a2c;
  font-weight: bold;
  display: none;
}

.user:hover .menu {
  animation: menuOpen 0.2s ease-in;
  animation-fill-mode:forwards ;
  display: block;
}

@keyframes menuOpen {
  0%{
    right: -200px;
    height: 0;
    top: 0px;
    opacity: 0;
  }
  50%{
    right: 2px;
  }
  100%{
    height: 150px;
    top: 50px;
    right: 2px;
    opacity: 1;
  }
}

.menu .challage{
  display: flex;
  height: 35px;
  width: 188px;
  margin-top: 2px;
  margin-left: 8px;
}

.medal{
  position: relative;
  width: 50px;
  height: 25px;
  margin: 5px;
  margin-top: 6px;
  background: #d4c599;
  border: 1px solid #3f3a2c;
  border-radius: 5px;
  font-size: 15px;
  display: block;
  cursor: pointer;
}

.menu .exp {
  position: relative;
  width: 185px;
  margin: 2px 5px;
}
.menu .operate {
  position: relative;
  height: 60px;
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  padding: 8px;
}
.menu .operate a {
  background-image: url(../assets/img/set/oak.png);
  font-size: 14px;
  border-radius: 3px;
  text-decoration: none;
  color: #131313;
  transition: all 250ms;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 25px;
}
.menu .operate a {
  margin: 0;
}

.notice_num{
  position: absolute;
  top: -8px;
  right: -5px;
  background-color: #4b3929;
  color: #f1f1f1;
  font-size: 12px;
  font-weight: bold;
  border-radius: 20px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  padding: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* 确保消息链接容器有相对定位，使通知徽章能正确定位 */
.operate > div {
  position: relative;
  display: inline-block;
}

.menu .operate a:hover{
  color: #f1f1f1;
  background-image: url(../assets/img/set/spruce.png);
}
.notice:hover a{
  color: #f1f1f1;
  background-image: url(../assets/img/set/spruce.png);
}


.unuser {
  position: absolute;
  line-height: 25px;
  text-align: center;
  right: 12px;
  top: 2px;
  background-image: url(../assets/img/set/spruce.png);
  width: 140px;
  height: 45px;
  color: #f1f1f1;
  cursor: pointer;
  border-radius: 5px;
  font-size: 18px;
  overflow: hidden;
  transition: all 250ms;
}
.unuser:hover {
  background-image: url(../assets/img/set/oak.png);
}
.unuser span:nth-child(1) {
  position: relative;
  top: 10px;
  transition: all 250ms;
}
.unuser span:nth-child(4) {
  position: relative;
  top: 0;
  color: #131313;
  font-size: 35px;
  font-stretch: expanded;
  transition: all 250ms;
}
.unuser:hover span:nth-child(1) {
  top: -40px;
}
.unuser:hover span:nth-child(4) {
  top: -40px;
}
.ul_border {
  border-top: 2px solid #8f8568;
  border-left: 2px solid #8f8568;
  border-right: 2px solid #3f3a2c;
  border-bottom: 2px solid #3f3a2c;
  transition: all 250ms;
}
.ul_border:hover {
  border-top: 2px solid #ada27f;
  border-left: 2px solid #ada27f;
  border-right: 2px solid #554e3c;
  border-bottom: 2px solid #554e3c;
}
</style>
