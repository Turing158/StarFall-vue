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
        <input type="text" class="user_input" name="user" maxlength="15" required />
        <span class="user_span">用户名：</span>
        <div class="user_underline"></div>
        <br />
        <input type="password" class="pass_input" name="password" required />
        <span class="pass_span">密&emsp;码：</span>
        <div class="pass_underline"></div>
        <br />
        <input type="text" class="email_input" name="email" required />
        <span class="email_span">邮&emsp;箱：</span>
        <div class="email_underline"></div>
        <br />
        <input type="text" class="code_input" name="code" maxlength="4" required />
        <span class="code_span">验证码：</span>
        <div class="code_underline"></div>
        <img src="" alt="VerifyCode" onclick="Change()" id="img_code" />
        <div class="operate">
          <router-link to="/login">
            <McBtn text="登录" :margin="25" />
          </router-link>
          <McBtn text="注册" :margin="25" />
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import McBtn from '@/components/McBtn.vue'
const toHref = (s)=>{
  window.location.href=s
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
  height: 400px;
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
  top: -14px;
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
.email_input {
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
.code_input {
  width: 165px;
}
.user_span,
.pass_span,
.code_span,
.email_span {
  position: absolute;
  pointer-events: none;
  font-size: 20px;
  left: 0;
  left: 46%;
  margin-left: -25%;
}
.user_underline,
.pass_underline,
.code_underline,
.email_underline {
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
.code_underline {
  width: 165px;
}
.user_input:focus ~ .user_span,
.pass_input:focus ~ .pass_span,
.code_input:focus ~ .code_span,
.email_input:focus ~ .email_span,
.user_input:valid ~ .user_span,
.pass_input:valid ~ .pass_span,
.code_input:valid ~ .code_span,
.email_input:valid ~ .email_span {
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
.email_input:valid ~ .email_underline {
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
  top: -32px;
  width: 80px;
  height: 30px;
  background-color: bisque;
}
.operate {
  display: flex;
  justify-content: center;
}
</style>
