<!-- 找回密码页面 -->

<template>
    <div class="out">
        <div class="forgetDiv">
            <router-link to="/login">
                <button class="back">
                    <span>Login</span>
                    <br />
                    <span>登录</span>
                </button>
            </router-link>
            <form>
                <br><br>
                <h1>找回密码</h1><br><br>
                <input type="text" class="pass_input" th:value="${session.forgetEmail}" name="email" v-model="email" required>
                <span class="pass_span">邮&emsp;箱：</span>
                <div class="pass_underline"></div>
                <br>
                <input type="search" class="email_code_input" name="code" v-model="emailCode" required>
                <span class="email_code_span">邮箱验证码：</span>
                <div class="email_code_underline"></div>
               <div class="getCode"><McBtn text="获取验证码" @click="onGetEmailCode()" :cooldown-tamp="timerStore.forgetPasswordTimer" delaySuffix="秒可获取"/></div>
                <br>
                <input type="search" class="code_input" name="code" v-model="code" required>
                <span class="code_span">验证码：</span>
                <div class="code_underline"></div>
                <Code ref="codeImg" class="code" width="100px" height="40px" margin="0 5px"/>
                <div class="operate">
                    <McBtn text="验&emsp;证" :width="100" :height="35" :font-size="18" @click="onCheck()"/>
                </div>
            </form>
        </div>
        <h2>请保管好，谨记好密码，谢谢!</h2>
        <el-dialog 
            v-model="forgetPage"
            title="新密码设置" 
            width="300" 
            :show-close="false"
            align-center
            @close="onClose()"
           >
            <el-input placeholder="请输入新密码" v-model="password"></el-input>
            <Empty :height="10"/>
            <el-input placeholder="请再次输入新密码" v-model="againPassword"></el-input>
            <template #footer>
              <div>
                <el-button style="width: 80px;" @click="forgetPage = false">取消</el-button>
                <el-button style="width: 80px;" type="primary" @click="confirm()">
                  确认
                </el-button>
              </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { checkForget, forgetPassword, getEmailCode } from '@/api/user';
import Code from '@/components/Code.vue';
import McBtn from '@/components/McBtn.vue';
import Empty from '@/components/FitEmpty.vue';
import useUserStore from '@/stores/user';
import useTimerStore from '@/stores/timer';
import { ElMessage, ElNotification } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElLoading } from 'element-plus'
const forgetPage = ref(false)
const password = ref('')
const againPassword = ref('')
const codeImg = ref()
const email = ref('')
const emailCode = ref('')
const code = ref('')
const timerStore = useTimerStore()
const onGetEmailCode = async() => {
    console.log(email.value)
    if(email.value.length == 0){
        ElMessage.error('邮箱不能为空')
    }
    else{
        let loading = ElLoading.service({
            lock: true,
            text: '发送中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        timerStore.setForgetPasswordTimer(Date.now()+60000)
        await getEmailCode(email.value,false).then(res=>{
        if(res.data.msg === "SUCCESS"){
            ElMessage.success('验证码发送成功')
        }
        else if(res.data.msg === "SEND_FAST_ERROR"){
            ElMessage.error('验证码发送过快')
        }
        else{
            ElMessage.error('验证码发送失败')
        }
        }).catch(err=>{
            ElMessage.error('验证码发送失败')
        })
        loading.close()
    }
}
const changeToken = ref()
const userStore = useUserStore()
const onCheck = async() => {
    if(!changeToken.value){
        if(email.value.length == 0){
            ElMessage.error('邮箱不能为空')
        }
        else if(emailCode.value.length == 0){
            ElMessage.error('邮箱验证码不能为空')
        }
        else if(code.value.length == 0){
            ElMessage.error('验证码不能为空')
        }
        else{
            let loading = ElLoading.service({
                lock: true,
                text: '验证中...',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            await checkForget(email.value,emailCode.value,codeImg.value.random+":"+code.value).then(res=>{
                let msg = res.data.msg
                if(msg === 'SUCCESS'){
                    changeToken.value = res.data.object
                    forgetPage.value = true
                }
                else if(msg === 'EMAIL_CODE_EXPIRED'){
                    ElMessage.error('邮箱验证码过期')
                }
                else if(msg === 'EMAIL_CODE_ERROR'){
                    ElMessage.error('邮箱验证码错误')
                }
                else if(msg === 'CODE_ERROR'){
                    ElMessage.error('验证码错误')
                }
            }).catch(err=>{
                ElMessage.error('验证失败')
                codeImg.value.changeCode()
            })
            loading.close()
        }
    }
    else{
        forgetPage.value = true
    }
}
const router = useRouter()
const confirm = async()=>{
    if(password.value.length == 0){
        ElMessage.error('密码不能为空')
    }
    else if(password.value.length < 6){
        ElMessage.error('密码长度不能小于6位')
    }
    else if(password.value.length > 20){
        ElMessage.error('密码长度不能大于20位')
    }
    else if(againPassword.value.length == 0){
        ElMessage.error('确认密码不能为空')
    }
    else if(password.value !== againPassword.value){
        ElMessage.error('两次密码不一致')
    }
    else{
        let loading = ElLoading.service({
            lock: true,
            text: '修改中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        await forgetPassword(changeToken.value,password.value).then(res=>{
            if(res.data.msg === "SUCCESS"){
                flag.value = false
                forgetPage.value = false
                ElNotification({
                    title: '提示',
                    message: '密码修改成功!请牢记密码！',
                    type: 'success'
                });
                userStore.setToken('')
                router.push('/login')
            }
            else{
                ElMessage.error('密码修改失败')
            }
        }).catch(err=>{
            ElMessage.error('密码修改失败')
        })
        loading.close()
    
    }
}
const flag = ref(true)
const onClose = ()=>{
    if(flag.value){
        ElNotification({
        title: '提示',
        message: '如果想再次打开修改密码界面，请再次点击验证!',
        type: 'warning'
      });
    }
}
</script>
<style scoped>
*{
    margin: 0;
    transition: all 0.2s;
    padding: 0;
}
.out {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../assets/img/forgetBg.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.forgetDiv{
    position: relative;
    width: 500px;
    height: 350px;
    /* background-color: rgb(207, 206, 206); */
    border-radius: 10px;
    box-shadow: 0px 0px 10px black;
    backdrop-filter:blur(10px);
}
.back{
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
    cursor: pointer;
}
.back span:first-child{
    position: relative;
    top: -20px;
}
.back span:last-child{
    position: relative;
    top: -18px;
}
.back:hover span:first-child{
    top: 5px;
}
.back:hover span:last-child{
    top: 18px;
}
h1{
    position: relative;
    left: 180px;
}
.user_input,.pass_input,.code_input,.email_code_input{
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
    font-family:Arial, Helvetica, sans-serif;
}
.code_input,.email_code_input{
    width: 165px;
}
.user_span,.pass_span,.code_span,.email_code_span{
    position: absolute;
    pointer-events: none;
    font-size: 20px;
    left: 0;
    left: 46%;
    margin-left: -25%;
}
.user_underline,.pass_underline,.code_underline,.email_code_underline{
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
.code_underline,.email_code_underline{
    width: 165px;
}
/* .user_span,.pass_span,.code_span */
.user_input:focus ~ .user_span,
.pass_input:focus ~ .pass_span,
.code_input:focus ~ .code_span,
.email_code_input:focus ~ .email_code_span,
.user_input:valid ~ .user_span,
.pass_input:valid ~ .pass_span,
.code_input:valid ~ .code_span,
.email_code_input:valid ~ .email_code_span{
    font-size: 15px;
    transform: translateY(-15px);
}
.user_input:focus ~ .user_underline,
.pass_input:focus ~ .pass_underline,
.code_input:focus ~ .code_underline,
.email_code_input:focus ~ .email_code_underline,
.user_input:valid ~ .user_underline,
.pass_input:valid ~ .pass_underline,
.code_input:valid ~ .code_underline,
.email_code_input:valid ~ .email_code_underline{
    transform: scaleX(1);
}
input[type=search]::-webkit-search-cancel-button{
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-size: 100% 100%;
    background-image: url(/img/icon/delete-icon.png);
}
input[type=password]::-ms-reveal{
    width: 20px;
    height: 20px;
}
.code{
    position: relative;
    left: 280px;
    top: -45px;
    width: 80px;
    height: 30px;
    background-color: bisque;
}
.confirm,.reg,.login{
    position: relative;
    width: 80px;
    height: 40px;
    font-size: 20px;
    border-radius: 10px;
    margin: 0 20px;
    background-color: rgb(223, 251, 252);
}
p{
    text-align: center;
    height: 40px;
    left: 150px;
}
.operate{
    position: relative;
    top: -20px;
    display: flex;
    justify-content: center;
}
.getCode {
position: absolute;
  right: 115px;
  margin-top: -35px;
}
.login{
    width: 100px;
}
.confirm:hover,.reg:hover,.login:hover{
    background-color: rgb(167, 211, 211);
}
h2{
    position: absolute;
    bottom: 50px;
    backdrop-filter: blur(10px);
    color: rgb(255, 127, 127);
}
</style>