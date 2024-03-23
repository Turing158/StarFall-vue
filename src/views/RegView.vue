<template>
  <div class="out">
    <div class="regDiv">
      <router-link to="/">
        <button class="back">
          <span>home</span>
          <br />
          <span>首页</span>
        </button>
      </router-link>
      <form method="get">
        <br /><br />
        <h1>注&emsp;册</h1>
        <br /><br />
        <input type="text" class="user_input" name="user" maxlength="15" required v-model="user" />
        <span class="user_span">用户名：</span>
        <div class="user_underline"></div>
        <br />
        <input type="password" class="pass_input" name="password" required v-model="password" />
        <span class="pass_span">密&emsp;码：</span>
        <div class="pass_underline"></div>
        <br />
        <input type="text" class="email_input" name="email" required v-model="email" />
        <span class="email_span">邮&emsp;箱：</span>
        <div class="email_underline"></div>
        <br />
        <input
          type="text"
          class="emailCode_input"
          name="emailCode"
          required
          v-model="emailCode"
          @input="upper"
          maxlength="6"
        />
        <div class="getCode" @click="onGetEmailCode()"><McBtn text="获取验证码" /></div>
        <span class="emailCode_span">邮箱验证码：</span>
        <div class="emailCode_underline"></div>
        <br />
        <input type="text" class="code_input" name="code" maxlength="4" required v-model="code" />
        <span class="code_span">验证码：</span>
        <div class="code_underline"></div>
        <img :src="codeImg" alt="VerifyCode" @click="changeCode()" id="img_code" />
        <div class="operate">
          <router-link to="/login">
            <McBtn text="登录" :margin="25" />
          </router-link>
          <div @click="onReg()">
            <McBtn text="注册" :margin="25" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import McBtn from '@/components/McBtn.vue'
import { getEmailCode, register } from '@/api/user'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import router from '@/router'
const user = ref('')
const password = ref('')
const email = ref('')
const emailCode = ref('')
const code = ref('')
const flag = ref(true)
const onGetEmailCode = async () => {
  if(flag.value){
    if (email.value.length != 0) {
      await getEmailCode(email.value)
        .then((res) => {
          let msg = res.data.msg
          if (msg == 'EMAIL_ERROR') {
            ElMessage.error('邮箱已存在')
          } else {
            ElMessage.success('验证码已发至邮箱')
            flag.value = false
            setTimeout(30000,()=>{
              flag.value = true
            })
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error('服务异常')
        })
    } else {
      ElMessage.error('邮箱不能为空')
    }
  }
}

const onReg = async () => {
  if (user.value.length < 6 || user.value.length > 15) {
    ElMessage.error('用户名不能小于6位或大于15位')
  } else if (password.value.length < 6 || password > 25) {
    ElMessage.error('密码不能少于6位或大于25位')
  } else if (email.value.length == 0) {
    ElMessage.error('邮箱不能为空')
  } else if (emailCode.value.length == 0) {
    ElMessage.error('邮箱验证码不能为空')
  } else if (code.value.length == 0) {
    ElMessage.error('验证码不能为空')
  } else {
    await register(user.value, password.value, email.value, emailCode.value, code.value)
      .then((res) => {
        let msg = res.data.msg
        if(msg == 'EMAIL_ERROR'){
          ElMessage.error('邮箱已存在')
        }
        else if(msg == 'EMAIL_CODE_ERROR'){
          ElMessage.error('邮箱验证码错误')
        }
        else if(msg == 'USER_ERROR'){
          ElMessage.error('用户名已存在')
        }
        else{
          ElMessage.success('注册成功')
          router.push('/login')
        }
      })
      changeCode()
      .catch((err) => {
        console.log(err)
        ElMessage.error('服务异常')
      })
  }
}
const upper = (e) => {
  emailCode.value = emailCode.value.toUpperCase()
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
  background-image: url(../assets/img/RegBg.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.regDiv {
  position: relative;
  width: 500px;
  height: 460px;
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
  top: -18px;
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
.code_input,
.email_input,
.emailCode_input {
  position: relative;
  outline: none;
  border: 0;
  height: 25px;
  width: 280px;
  font-size: 20px;
  border-bottom: 2px solid rgb(143, 143, 143);
  background-color: initial;
  left: 46%;
  margin-left: -25%;
  font-family: Arial, Helvetica, sans-serif;
}
.code_input,
.emailCode_input {
  width: 165px;
}
.user_span,
.pass_span,
.code_span,
.email_span,
.emailCode_span {
  position: absolute;
  pointer-events: none;
  font-size: 20px;
  left: 0;
  left: 46%;
  margin-left: -25%;
}
.emailCode_span {
  font-size: 18px;
}
.user_underline,
.pass_underline,
.code_underline,
.email_underline,
.emailCode_underline {
  position: relative;
  width: 280px;
  height: 2px;
  top: -2px;
  left: 0;
  transform: scaleX(0);
  background-color: rgb(60, 120, 129);
  left: 46%;
  margin-left: -25%;
  box-shadow: 0px 0px 1px rgb(170, 170, 170);
}
.code_underline,
.emailCode_underline {
  width: 165px;
}
.user_input:focus ~ .user_span,
.pass_input:focus ~ .pass_span,
.code_input:focus ~ .code_span,
.email_input:focus ~ .email_span,
.emailCode_input:focus ~ .emailCode_span,
.user_input:valid ~ .user_span,
.pass_input:valid ~ .pass_span,
.code_input:valid ~ .code_span,
.email_input:valid ~ .email_span,
.emailCode_input:valid ~ .emailCode_span {
  font-size: 15px;
  transform: translateY(-15px);
}
.user_input:focus ~ .user_underline,
.pass_input:focus ~ .pass_underline,
.code_input:focus ~ .code_underline,
.email_input:focus ~ .email_underline,
.user_input:valid ~ .user_underline,
.pass_input:valid ~ .pass_underline,
.code_input:valid ~ .code_underline,
.email_input:valid ~ .email_underline,
.emailCode_input:valid ~ .emailCode_underline {
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
.getCode {
  position: absolute;
  right: 120px;
  margin-top: -35px;
}
</style>
