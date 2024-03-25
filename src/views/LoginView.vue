<template>
  <div class="out">
    <div class="loginDIv" v-on:keydown.enter="confirm">
      <router-link to="/">
        <button class="back">
          <span>home</span>
          <br />
          <span>首页</span>
        </button>
      </router-link>
      <form method="get">
        <br /><br />
        <h1>登&emsp;录</h1>
        <br /><br />
        <input type="text" class="user_input" name="user" required v-model="account" />
        <span class="user_span">用户名：</span>
        <div class="user_underline"></div>
        <br />
        <input type="password" class="pass_input" name="password" required v-model="password" />
        <span class="pass_span">密&emsp;码：</span>
        <div class="pass_underline"></div>
        <br />
        <input type="text" class="code_input" name="login_code" required v-model="code" />
        <span class="code_span">验证码：</span>
        <div class="code_underline"></div>
        <img :src="codeImg" alt="VerifyCode" @click="changeCode()" id="img_code" />
        <div class="operate">
          <router-link to="/reg">
            <McBtn text="注册" :margin="0" />
          </router-link>
          <McBtn text="登录" :margin="50" @click="confirm()" />
          <router-link to="/forget">
            <McBtn text="忘记密码" :margin="0" />
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import McBtn from '@/components/McBtn.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'
import { ElMessage,ElNotification } from 'element-plus'
import useUserStore from '@/stores/user'
const router = useRouter()
const account = ref('')
const password = ref('')
const code = ref('')
const userStore = useUserStore()
const confirm = async () => {
  if (account.value.length == 0) {
    ElMessage.error('账户不能为空')
  } else if (password.value.length == 0) {
    ElMessage.error('密码不能为空')
  } else if (code.value.length == 0) {
    ElMessage.error('验证码不能为空')
  } else {
    await login(account.value, password.value, code.value)
      .then((res) => {
        let msg = res.data.msg
        if (msg == 'USER_PASSWORD') {
          ElMessage.error('用户名错误或不存在')
        } else if (msg == 'EMAIL_ERROR') {
          ElMessage.error('邮箱错误或不存在')
        } else if (msg == 'PASSWORD_ERROR') {
          ElMessage.error('密码错误')
        } else if (msg == 'CODE_ERROR') {
          ElMessage.error('验证码错误')
        } else {
          ElNotification({
              title: '登录成功',
              message:'已前往主页，愉快的进行探索吧！',
              type:'success'
            })
          let data = res.data.object
          console.log(data);
          userStore.setUserObject(
            data.user,
            data.name,
            data.level,
            data.exp,
            data.maxExp,
            data.gender,
            data.birthday,
            data.avatar,
            data.email
          )
          userStore.setLogin(true)
          router.push('/')
        }
        changeCode()
      })
      .catch((err) => {
        ElMessage.error('服务异常')
      })
  }
}
let date = new Date()
const codeImg = ref('http://localhost:8080/getCodeImage?r' + date.getTime())
const changeCode = () => {
  codeImg.value = 'http://localhost:8080/getCodeImage?r' + new Date().getTime()
}
</script>
<style scoped>
.out {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  background-image: url(../assets/img/loginBg.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.loginDIv {
  position: relative;
  width: 500px;
  height: 370px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px black;
  backdrop-filter: blur(10px);
}
.back {
  position: absolute;
  background-color: none;
  height: 35px;
  width: 65px;
  font-size: 18px;
  overflow: hidden;
  display: block;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  color: aliceblue;
  border-radius: 5px;
}
.back span:first-child {
  position: relative;
  top: -20px;
}
.back span:last-child {
  position: relative;
  top: -16px;
}
.back:hover span:first-child {
  top: 5px;
}
.back:hover span:last-child {
  top: 18px;
}

h1 {
  position: relative;
  left: 200px;
}
.user_input,
.pass_input,
.code_input {
  position: relative;
  outline: none;
  border: 0;
  height: 30px;
  width: 280px;
  font-size: 20px;
  border-bottom: 2px solid rgb(206, 206, 206);
  background-color: initial;
  left: 46%;
  margin-left: -25%;
  font-family: Arial, Helvetica, sans-serif;
}
.code_input {
  width: 165px;
}
.user_span,
.pass_span,
.code_span {
  position: absolute;
  pointer-events: none;
  font-size: 20px;
  left: 0;
  left: 46%;
  margin-left: -25%;
  color: aliceblue;
}
.user_underline,
.pass_underline,
.code_underline {
  position: relative;
  width: 280px;
  height: 2px;
  top: -2px;
  left: 0;
  transform: scaleX(0);
  background-color: rgb(99, 191, 206);
  left: 46%;
  margin-left: -25%;
  box-shadow: 0px 0px 1px rgb(170, 170, 170);
}
.code_underline {
  width: 165px;
}
.user_input:focus ~ .user_span,
.pass_input:focus ~ .pass_span,
.code_input:focus ~ .code_span,
.user_input:valid ~ .user_span,
.pass_input:valid ~ .pass_span,
.code_input:valid ~ .code_span {
  font-size: 15px;
  transform: translateY(-15px);
}
.user_input:focus ~ .user_underline,
.pass_input:focus ~ .pass_underline,
.code_input:focus ~ .code_underline,
.user_input:valid ~ .user_underline,
.pass_input:valid ~ .pass_underline,
.code_input:valid ~ .code_underline {
  transform: scaleX(1);
}
input[type='search']::-webkit-search-cancel-button {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-size: 100% 100%;
  background-image: url(/img/icon/delete-icon.png);
}
input[type='password']::-ms-reveal {
  width: 20px;
  height: 20px;
}
img {
  position: relative;
  left: 280px;
  top: -45px;
  width: 100px;
  height: 40px;
  background-color: bisque;
  cursor: pointer;
}
.operate {
  display: flex;
  justify-content: center;
}
</style>
