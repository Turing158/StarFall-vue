<template>
  <ul id="ul">
    <minSearch></minSearch>
    <li class="ul_li" v-for="(item, index) in UlItem" :key="index">
      <router-link
        v-show="item.eName != 'blog'"
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
      <img th:src="@{'/head_img/'+${session.user.head}}" alt="" class="head_img" />
      <div class="menu">
        <p th:text="${session.user.name}">User</p>
        <div class="exp">
          <ExpBar :lv="1" :exp="30" :maxExp="382" />
        </div>
        <div class="operate">
          <router-link class="ul_border" to="/personal">设置</router-link>
          <router-link class="ul_border" to="/signIn" @click="PageIndex = -1">签到</router-link>
          <router-link class="ul_border" to="/exit">退出</router-link>
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
import { ref } from 'vue'
import minSearch from './minSearch.vue'
import ExpBar from './ExpBar.vue'
const props = defineProps({
  pageIndex: {
    type: Number,
    default: -1
  },
  isLogin: {
    type: Boolean,
    default: false,
    require: false
  }
})
const isLogin = ref(props.isLogin)
const UlItem = ref([
  {
    name: '主页',
    eName: 'home',
    href: '/',
    admin: false
  },
  {
    name: '博客',
    eName: 'blog',
    href: 'https://turing158.github.io',
    admin: false
  },
  {
    name: '主题',
    eName: 'topic',
    href: '/topic',
    admin: false
  },
  {
    name: '管理',
    eName: 'admin',
    href: '/admin',
    admin: true
  }
])

const PageIndex = ref(props.pageIndex)
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
  top: 5px;
  padding: 0px 25px;
  color: #f1f1f1;
  background-image: url(../assets/img/set/spruce.png);
  border-radius: 5px;
  background-size: 100%;
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
}
.ul_li a:hover:not(.active) b {
  display: inline-block;
  top: 20px;
}
.ul_li a:hover:not(.active) span {
  display: inline-block;
  top: -20px;
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
ul .head_img {
  position: relative;
  background-color: #f1f1f1;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
}
.user:hover .head_img {
  border-radius: 10px 10px 0px 0px;
  width: 150px;
}
.user {
  position: absolute;
  float: right;
  right: 18px;
  border: 2px solid #f1f1f1;
  color: #f1f1f1;
  border-radius: 10px;
  text-align: center;
  width: 50px;
  height: 50px;
}
.user:hover {
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 150px;
}
.menu {
  position: relative;
  background-image: url(../assets/img/set/birch.png);
  background-size: 100%;
  border-radius: 0px 0px 5px 5px;
  width: 150px;
  height: 115px;
  top: -2px;
  /* right: 108px; */
  right: -100px;
  opacity: 1;
  color: #131313;
  box-shadow: 0px 4px 4px rgb(0, 0, 0);
  border-top: 0;
  z-index: -1;
  transition: all 250ms;
  border-left: 2px solid #8f8568;
  border-right: 2px solid #3f3a2c;
  border-bottom: 2px solid #3f3a2c;
  font-weight: bold;
}
.menu p {
  position: relative;
  margin: 0;
  font-size: 18px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.menu .exp {
  position: relative;
  width: 135px;
  margin: 2px 5px;
}
.menu .operate {
  position: relative;
  height: 20px;
  margin-top: 15px;
}
.menu .operate a {
  background-image: url(../assets/img/set/oak.png);
  font-size: 14px;
  padding: 3px 5px;
  border-radius: 3px;
  text-decoration: none;
  color: #131313;
}
.menu .operate a:nth-child(2) {
  margin: 0 5px;
}
.menu .operate a:hover {
  color: #f1f1f1;
  background-image: url(../assets/img/set/spruce.png);
}
.user:hover .menu {
  right: 1px;
  border-top: 0;
  opacity: 1;
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
}
.unuser:hover {
  background-image: url(../assets/img/set/oak.png);
}
.unuser span:nth-child(1) {
  position: relative;
  top: 10px;
}
.unuser span:nth-child(4) {
  position: relative;
  top: 0;
  color: #131313;
  font-size: 35px;
  font-stretch: expanded;
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
}
.ul_border:hover {
  border-top: 2px solid #ada27f;
  border-left: 2px solid #ada27f;
  border-right: 2px solid #554e3c;
  border-bottom: 2px solid #554e3c;
}
</style>
