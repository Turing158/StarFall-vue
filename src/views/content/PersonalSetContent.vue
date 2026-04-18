<template>
  <Book>
    <Empty :height="30" />
    <div class="set_container">
      <div class="set_item">
        <div class="setHead">
          <div class="avatarOut">
            <img class="avatar" :src="avatar" alt="" @click="setAvatarPage = true"/>
          </div>
          <input class="setAvatarInput" ref="fileInput" type="file" accept="image/jpeg, image/png, image/jpg"/>
          {{ tip }}
          <el-dialog
            title="裁剪头像"
            v-model="setAvatarPage"
            width="600"
          >
          <div class="cropperDiv">
            <VueCropper 
              class="cropper"
              ref="cropper" 
              :img="avatar" 
              :outputSize="option.outputSize"
              :outputType="option.outputType" 
              :info="option.info" 
              :canScale="option.canScale" 
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth" 
              :autoCropHeight="option.autoCropHeight" 
              :fixedBox="option.fixedBox"
              :fixed="option.fixed" 
              :fixedNumber="option.fixedNumber" 
              :canMove="option.canMove" 
              :canMoveBox="option.canMoveBox"
              :original="option.original" 
              :centerBox="option.centerBox" 
              :infoTrue="option.infoTrue" 
              :full="option.full"
              :enlarge="option.enlarge" 
              :mode="option.mode"
              @realTime="realTime"
              >
            </VueCropper>
            <div class="operateClip">
              <div class="preview">
                <div class="previewChild" :style="{scale:100/preview.h}" >
                  <div v-html="preview.html"></div>
                </div>
              </div>
              <Empty :height="20" />
              <McBtn :width="100" text="顺时针旋转90°" @click="cropper.rotateRight()"/>
              <Empty :height="10" />
              <McBtn :width="100" text="逆时针旋转90°"  @click="cropper.rotateLeft()"/>
              <Empty :height="10" />
              <McBtn :width="100" text="裁剪"  @click="onclip()"/>
            </div>
          </div>
          </el-dialog>
          <div @click="confirmAvatar()"><McBtn text="保存头像" /></div>
        </div>
        <div class="setInfo">
          <table>
            <tr>
              <td>昵称 :</td>
              <td><el-input v-model="name" maxlength="10"/></td>
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
              <td><el-date-picker v-model="birthday" type="date" placeholder="请选择出生日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/></td>
            </tr>
            <tr>
              <td>验证码:</td>
              <td style="display: flex">
                <el-input placeholder="请输入验证码" style="width: 140px" v-model="code" />
                <Code ref="codeImg" class="code" width="75px" height="30px" margin="0 2px" />
              </td>
            </tr>
          </table>
        </div>
        <Empty :height="20" />
        <div class="operate">
          <McBtn text="重置" :margin="10" @click="reset()" />
          <McBtn text="保存" :margin="10" @click="onSaveInfo()" />
        </div>
      </div>
      <div class="set_item">
        <div class="privacy-settings">
          <div class="setting-title">隐私设置</div>
          <div class="setting-group">
            <div class="setting-row">
              <span class="setting-label">正版ID：</span>
              <el-input v-model="privacySettings.onlineName" placeholder="请输入正版ID" style="width: 200px" maxlength="20" />
              <McBtn text="正版验证" :margin="10" @click="openVerifyOnlineName = true" />
            </div>
            <div class="setting-row">
              <span class="setting-label">显示正版ID：</span>
              <el-radio-group v-model="privacySettings.showOnlineName">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="0">不显示</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-row">
              <span class="setting-label">显示收藏夹：</span>
              <el-radio-group v-model="privacySettings.showCollection">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="0">不显示</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-row">
              <span class="setting-label">显示生日：</span>
              <el-radio-group v-model="privacySettings.showBirthday">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="0">不显示</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-row">
              <span class="setting-label">显示性别：</span>
              <el-radio-group v-model="privacySettings.showGender">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="0">不显示</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-row">
              <span class="setting-label">显示邮箱：</span>
              <el-radio-group v-model="privacySettings.showEmail">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="0">不显示</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-row">
              <span class="setting-label">验证码：</span>
              <div style="display: flex; align-items: center;">
                <el-input placeholder="请输入验证码" style="width: 140px" v-model="privacyCode" />
                <Code ref="codeImgPrivacy" class="code" width="75px" height="30px" margin="0 2px" />
              </div>
            </div>
          </div>
          <div class="setting-operate">
            <McBtn text="重置" :margin="10" @click="resetPrivacySettings()" />
            <McBtn text="保存" :margin="10" @click="savePrivacySettings()" />
          </div>
        </div>
      </div>
    </div>
    <div class="set_signature">
      <div style="width: 780px;">
        <ContentEditor ref="contentEdit" :value="personalized.signature" :maxHeight="200" :maxLength="500" editBtnStyle="right: 100px"/>
      </div>
      <div style="width: 1px; border-right: 1px solid #6e5d3e; margin: 0 2px;"></div>
      <div class="signature-operate">
        <div class="signature-operate-item">
          <el-input v-model="signatureCode" style="width: 80px" placeholder="验证码" />
          <Code ref="codeImgSignature" class="code" width="75px" height="30px" />
          <span></span>
          <div style="display: flex; justify-content: center;">
            <McBtn text="保存" @click="saveSignature()"/>
          </div>
        </div>
      </div>
      <el-dialog 
      title="正版验证" 
      v-model="openVerifyOnlineName" 
      width="50%"
      :close-on-click-modal="false"
      >
      <div class="verify-container">
        <transition name="step-transition" mode="out-in">
          <div :key="verifyStep">
            <!-- 步骤 1 -->
            <div v-if="verifyStep === 1" class="verify-item">
              <h2>欢迎使用论坛正版登录验证</h2>
              <p>此次验证并不会记录你的任何账号信息</p>
              <p>请点击下方按钮，获取该次验证的代码</p>
              <el-button type="primary" @click="handleDeviceCode" :loading="verifyLoading">点击获取机器码</el-button>
              <p v-show="verifyLoading">正在获取该次验证的代码...</p>
            </div>
            
            <!-- 步骤 2 -->
            <div v-if="verifyStep === 2" class="verify-item">
              <p>已将代码复制至剪切板，若未复制，请直接点击下方代码复制</p>
              <p>现在请点击下面链接，输入并验证代码，完成微软登录</p>
              <a href="https://www.microsoft.com/link" target="_blank">https://www.microsoft.com/link</a>
              <p class="click-anim can-select" style="font-size: 28px;" @click="copyCode">{{ verifyCode }}</p>
              <p>验证完成后，点击下方按钮确认,并检测此次验证</p>
              <el-button type="primary" @click="handleVerifyDeviceCode" :loading="verifyLoading">点击验证</el-button>
            </div>
            
            <!-- 步骤 3 -->
            <div v-if="verifyStep === 3" class="verify-item">
              <h2>验证成功！</h2>
              <p>正在处理剩下的验证步骤...({{ lastVerifyStep }}/4)</p>
              <transition name="step-transition" mode="out-in">
                <div :key="lastVerifyStep">
                  <p v-if="lastVerifyStep === 1">XBox身份验证...</p>
                  <p v-if="lastVerifyStep === 2">XSTS 身份验证...</p>
                  <p v-if="lastVerifyStep === 3">获取MinecraftToken...</p>
                  <p v-if="lastVerifyStep === 4">正在获取Minecraft正版信息...</p>
                </div>
              </transition>
            </div>

            <div v-if="verifyStep === 4" class="verify-item">
              <h2>获取成功！</h2>
              <p>你好！尊贵的正版玩家</p>
              <p class="click-anim" style="font-size: 20px; font-weight: bold;">{{ privacySettings.onlineName }}</p>
              <p>若未获取“正版玩家”勋章，会自动颁发此勋章</p>
              <p>若已获取“正版玩家”勋章，无需重复验证</p>
            </div>

            <div v-if="verifyStep === 5" class="verify-item">
              <h2>获取失败！</h2>
              <p>请检查你的Minecraft正版账号是否绑定到Microsoft账号</p>
              <p>又或者你暂时还未获取正版Minecraft</p>
              <p>可通过以下链接登录微软账号刷新一下正版Minecraft账户的数据</p>
              <a href="https://www.minecraft.net/zh-hans" target="_blank">https://www.minecraft.net/zh-hans</a>
            </div>
          </div>
        </transition>
      </div>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="resetVerify" v-if="verifyError">重试</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </Book>
</template>
<script setup>
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import { onMounted, ref ,reactive } from 'vue'
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
import useUserStore from '@/stores/user'
import { ElMessage, ElNotification, ElLoading } from 'element-plus'
import { saveInfo, settingAvatar, getSelfPersonalized, updatePersonalized, updateSignature, getDeviceCode, verifyDeviceCode, getMinecraftInfo, getAvatarSrc } from '@/api/user'
import Code from '@/components/Code.vue'
import ContentEditor from '@/components/ContentEditor.vue'
import { useRouter } from 'vue-router';
import { minecraftApi, request } from '@/util/request';
const codeImg = ref()
const codeImgPrivacy = ref(null)
const codeImgSignature = ref(null)
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
const checkGenderToLabel = (value) => {
  switch (value) {
    case 0:
      return '隐藏'
    case 1:
      return '男'
    case 2:
      return '女'
    case 3:
      return '沃尔玛购物袋'
  }
}
const checkGenderToValue = (label) => {
  switch (label) {
    case '隐藏':
      return 0
    case '男':
      return 1
    case '女':
      return 2
    case '沃尔玛购物袋':
      return 3
    default: return label
  }
}
const gender = ref(checkGenderToLabel(userStore.gender))
const birthday = ref(userStore.birthday)
const code = ref('')
const privacyCode = ref('')
const signatureCode = ref('')

const contentEdit = ref(null)
const privacySettings = reactive({
  onlineName: '',
  showOnlineName: 0,
  showCollection: 0,
  showBirthday: 0,
  showGender: 0,
  showEmail: 0
})
const personalized = ref({})
const getPersonalized = async() =>{
  await getSelfPersonalized()
  .then(res=>{
    personalized.value = res.data.object
    resetPrivacySettings()
  })
  .catch(err=>{
    ElMessage.error('获取个人化设置失败')
  })
}
const resetPrivacySettings = () => {
  privacySettings.onlineName = personalized.value.onlineName
  privacySettings.showOnlineName = personalized.value.showOnlineName
  privacySettings.showCollection = personalized.value.showCollection
  privacySettings.showBirthday = personalized.value.showBirthday
  privacySettings.showGender = personalized.value.showGender
  privacySettings.showEmail = personalized.value.showEmail
}
const savePrivacySettings = async() => {
  if(privacyCode.value.length == 0){
    ElMessage.error('请输入验证码')
    return
  }
  privacySettings.code = codeImgPrivacy.value.random+':'+privacyCode.value
  let loading = ElLoading.service({
    lock: true,
    text: '正在修改...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await updatePersonalized(privacySettings)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      ElMessage.success('保存成功')
      personalized.value.onlineName = privacySettings.onlineName
      personalized.value.showOnlineName = privacySettings.showOnlineName
      personalized.value.showCollection = privacySettings.showCollection
      personalized.value.showBirthday = privacySettings.showBirthday
      personalized.value.showGender = privacySettings.showGender
      personalized.value.showEmail = privacySettings.showEmail
      privacyCode.value = ''
      codeImgPrivacy.value.changeCode()
    }
    else if(res.data.msg == 'CODE_ERROR'){
      ElMessage.error('验证码错误')
    }
    else{
      ElMessage.error('保存失败')
    }
  })
  .catch(err=>{
    ElMessage.error('保存失败')
  })
  loading.close()
}
const onSaveInfo = async () => {
  if (
    name.value == userStore.name &&
    gender.value == checkGenderToLabel(userStore.gender) &&
    birthday.value == userStore.birthday
  ) {
    ElNotification({
      title: '未修改',
      message: '用户信息未修改',
      type: 'warning'
    })
  } else {
    if(name.value.length <= 10){
      if(code.value.length != 0){
        let loading = ElLoading.service({
          lock: true,
          text: '正在修改...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        await saveInfo(name.value, checkGenderToValue(gender.value),birthday.value,codeImg.value.random+":"+code.value)
          .then((res) => {
            let msg = res.data.msg
            
            if (msg == 'CODE_ERROR') {
              ElMessage.error('验证码错误')
            } 
            else if(msg == 'DATASOURCE_ERROR'){
              ElMessage.error('服务器数据库异常')
            }
            else {
              let data = res.data.object
              userStore.setUserObject(data.user,data.name,data.level,data.exp,data.maxExp,data.gender,data.birthday,data.avatar,data.email,data.role)
              name.value = data.name,
              gender.value = checkGenderToLabel(data.gender)
              birthday.value = data.birthday
              ElNotification({
                title: '保存成功',
                message: '已将用户信息保存',
                type: 'success'
              })
              code.value = ''
              codeImg.value.changeCode()
            }
          })
          .catch((err) => {
            ElMessage.error('服务异常')
          }).finally(() => {
            loading.close()
          })
      }
      else{
      ElMessage.error('验证码不能为空')
    }
    }
    else{
      ElMessage.error('昵称长度不能超过10位')
    }
    
  }
}
const reset = () => {
  name.value = userStore.name
  gender.value = checkGenderToLabel(userStore.gender)
  birthday.value = userStore.birthday
}
const cropper = ref()
const fileInput = ref()
const tip = ref('')
const avatar = ref(userStore.avatar)
const init = ()=>{
  getPersonalized()
  fileInput.value.addEventListener('change', function() {
    let fileInputValue = fileInput.value
        // 清除背景图片:
        if (!fileInputValue.value) {
            fileInputValue.value = "";
            return;
        }
        let file = fileInputValue.files[0];
        let size = file.size;
        if (size >= 5 * 1024 * 1024) {
          fileInputValue.value = "";
          ElMessage.error('文件大小超出限制(5MB)');
          return false;
        }
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          fileInputValue.value = "";
          ElMessage.error('不是有效的图片文件!');
          return;
        }
        // 读取文件:
        let reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            avatar.value = data
            setAvatarPage.value = true
        };
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
    });
}

const setAvatarPage = ref(false)
const confirmAvatar = async()=>{
  if(avatar.value == userStore.avatar){
    ElMessage.error('请先选择图片')
  }
  else{
    let loading = ElLoading.service({
      lock: true,
      text: '正在修改...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await settingAvatar(avatar.value).then(res=>{
      let msg = res.data.msg
      if(msg == 'SUCCESS'){
        ElNotification({
          title: '保存成功',
          message: '已将头像保存',
          type: 'success'
        })
        let fileName = res.data.object
        userStore.setAvatar(fileName)
        avatar.value =  getAvatarSrc(fileName)
      }
      else{
        ElMessage.error('更改头像失败')

      }
    }).finally(() => {
      loading.close()
    })
  }
}
const option = reactive({
  outputSize: 1, // 裁剪生成图片的质量
  outputType: 'png', // 裁剪生成图片的格式 jpeg, png, webp
  info: true, // 裁剪框的大小信息
  canScale: false, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 100, // 默认生成截图框宽度
  autoCropHeight: 100, // 默认生成截图框高度
  fixedBox: false, // 固定截图框大小 不允许改变
  fixed: true, // 是否开启截图框宽高固定比例，这个如果设置为true，截图框会是固定比例缩放的，如果设置为false，则截图框的狂宽高比例就不固定了
  fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  full: true, // 是否输出原图比例的截图
  enlarge: '1', // 图片根据截图框输出比例倍数
  mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto
})
const preview = ref('')
const realTime = (data) => {
  preview.value = data
}
const onclip = ()=>{
  cropper.value.getCropData(data=>{
    avatar.value = data
    setAvatarPage.value = false
  })
}
const saveSignature = async()=>{
  await updateSignature(contentEdit.value.content,codeImgSignature.value.random+':'+signatureCode.value)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      ElNotification({
        title: '保存成功',
        message: '已将签名保存',
        type: 'success'
      })
      privacySettings.signature = contentEdit.value.content
      signatureCode.value = ''
      codeImgSignature.value.changeCode()
      contentEdit.value.change()
    }
    else if(res.data.msg == 'CODE_ERROR'){
      ElMessage.error('验证码错误')
    }
    else{
      ElMessage.error('更改签名失败')
    }
  })
}
// =============正版验证==========================
const openVerifyOnlineName = ref(false)
const verifyStep = ref(1)
const lastVerifyStep = ref(0)
const verifyLoading = ref(false)
const deviceCode = ref('')
const verifyCode = ref('')
const verifyError = ref(false)

const resetVerify = () => {
  verifyStep.value = 1
  lastVerifyStep.value = 0
  deviceCode.value = ''
  verifyCode.value = ''
  verifyError.value = false
}

const handleDeviceCode = async()=>{
  console.log('handleDeviceCode')
  verifyLoading.value = true
  await getDeviceCode()
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      console.log(res)
      let data = JSON.parse(res.data.object)
      verifyCode.value = data.user_code
      deviceCode.value = data.device_code
      verifyStep.value++
    }
    else{
      ElMessage.error('获取验证码失败')
    }
  })
  .catch(err=>{
    ElMessage.error('获取验证码失败')
  })

  verifyLoading.value = false
}
const handleVerifyDeviceCode = async()=>{
  console.log('handleVerifyDeviceCode')
  verifyLoading.value = true
  let isSuccess = false
  await verifyDeviceCode(deviceCode.value).then(res=>{
    if(res.data.msg == 'SUCCESS'){
      console.log(res)
      let token = JSON.parse(res.data.object).access_token
      XBoxVerify(token)
      verifyStep.value++
      isSuccess = true
    }
    else if(res.data.msg == 'AUTHORIZATION_PENDING'){
      ElMessage.error('请先完成授权')
    }
    else if(res.data.msg == 'SLOW_DOWN'){
      ElMessage.error('请求过于频繁，请稍后再试')
    }
    else if(res.data.msg == 'GET_TOKEN_ERROR'){
      ElMessage.error('获取token失败')
    }
    else{
      ElMessage.error('验证失败,请完成验证步骤再试')
    }
  })
  .catch(err=>{
    ElMessage.error('验证失败,请点击下方重试')
  })
  if(!isSuccess){
    verifyError.value = true
  }

  verifyLoading.value = false
  verifyDeviceCode.value = ''
}
const XBoxVerify = async(token)=>{
  console.log('XBoxVerify')
  lastVerifyStep.value = 1
  let isSuccess = false
  await request.post(
    "https://user.auth.xboxlive.com/user/authenticate",
    {
      "Properties": {
          "AuthMethod": "RPS",
          "SiteName": "user.auth.xboxlive.com",
          "RpsTicket": `d=${token}`
      },
      "RelyingParty": "http://auth.xboxlive.com",
      "TokenType": "JWT"
    }
  )
  .then(res=>{
    let data = res.data
    console.log(res)
    if(data){
      let token = data.Token
      XSTSVerify(token)
      isSuccess = true
    }
    else{
      ElMessage.error('验证失败,请点击下方重试')
    }
  })
  .catch(err=>{
    console.log(err)
    ElMessage.error('验证失败,请点击下方重试')
  })
  if(!isSuccess){
    verifyError.value = true
  }
}
const XSTSVerify = async(token)=>{
  console.log('XSTSVerify')
  lastVerifyStep.value = 2
  let isSuccess = false
  await request.post(
    "https://xsts.auth.xboxlive.com/xsts/authorize",
    {
      "Properties": {
          "SandboxId": "RETAIL",
          "UserTokens": [
              token
          ]
      },
      "RelyingParty": "rp://api.minecraftservices.com/",
      "TokenType": "JWT"
    }
  )
  .then(res=>{
    console.log(res)
    if(!res.data){
      ElMessage.error('验证失败,请点击下方重试')
      return 
    }
    let data = res.data
    if(data.XErr){
      ElMessage.error('验证失败,请点击下方重试')
      return 
    }
    getMinecraftToken(data.Token,data.DisplayClaims.xui[0].uhs)
    isSuccess = true
  })
  .catch(err=>{
    ElMessage.error('验证失败,请点击下方重试')
  })
  if(!isSuccess){
    verifyError.value = true
  }
}
const getMinecraftToken = async(token, uhs) =>{
  console.log('getMinecraftToken')
  if(!uhs){
    ElMessage.error('验证失败,请点击下方重试')
    verifyError.value = true
    return 
  }
  let isSuccess = false
  lastVerifyStep.value = 3
  console.log(token, uhs)
  await minecraftApi.post(
    "",
    {
      "identityToken": `XBL3.0 x=${uhs};${token}`
    }
  )
  .then(res=>{
    console.log(res)
    let data = res.data
    if(data.error){
      ElMessage.error('验证失败,请点击下方重试')
      return 
    }
    verifyMinecraftToken(data.access_token)
    isSuccess = true
  })
  .catch(err=>{
    ElMessage.error('验证失败,请点击下方重试')
  })
  if(!isSuccess){
    verifyError.value = true
  }
  verifyLoading.value = false
}
const verifyMinecraftToken = async(token) =>{
  console.log('verifyMinecraftToken')
  let isSuccess = false
  lastVerifyStep.value = 4
  await getMinecraftInfo(token).then(res=>{
    console.log(res)
    if(res.data.msg == 'SUCCESS'){
      let info = JSON.parse(res.data.object)
      if(!info.id){
        ElMessage.error('获取失败,请查看详情')
        verifyStep.value = 5
        return 
      }
      ElMessage.success('验证成功')
      privacySettings.onlineName = info.name
      verifyStep.value = 4
      isSuccess = true
    }
    else if(res.data.msg == 'VERIFY_FAILED'){
      ElMessage.error('获取失败,请查看详情')
      verifyStep.value = 5
    }
    else{
      ElMessage.error('验证失败,请点击下方重试')
    }
  })
  .catch(err=>{
    console.log(err)
    ElMessage.error('验证失败,请点击下方重试')
  })
  if(!isSuccess){
    verifyError.value = true
  }
}
const copyCode = ()=>{
  if(!verifyCode.value){
    ElMessage.error('请先获取验证码')
    return
  }
  navigator.clipboard.writeText(verifyCode.value)
  ElMessage.success('复制成功')
}
// =============正版验证==========================
onMounted(init)
</script>
<style scoped>
.set_container{
  display: flex;
  margin-top: 20px;
}
.set_container .set_item:nth-child(2){
  border-left: 1px solid #6e5d3e;
}
.set_item{
  flex: 1;
}
.set_signature{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #6e5d3e;
  display: flex;
}
.setHead {
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}
.avatarOut{
  width: 100px;
  height: 100px;
  background-color: aliceblue;
}
.avatar {
  width: 90px;
  height: 90px;
  margin: 5px;
  background-size: cover;
  image-rendering: auto;
}
.setAvatarInput{
  position: absolute;
  width: 100px;
  height: 100px;
  margin-top: 10px;
  opacity: 0;
  cursor: pointer;
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
  position: relative;
  margin-top: -30px;
  margin-left: 70px;
}
.cropperDiv{
  height: 300px;
  display: flex;
}
.cropper{
  width: 300px;
  height: 300px;
}
.operateClip{
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-left: 80px;
}
.preview{
  width: 100px;
  height: 100px;
  
}
.previewChild{
  width: 100px;
  transform-origin: 0 0;
}
.privacy-settings {
  padding: 20px;
}
.setting-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #6e5d3e;
}
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.setting-row {
  display: flex;
  align-items: center;
}
.setting-label {
  width: 120px;
  font-size: 14px;
  color: #333;
}
.setting-operate {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.success {
  color: #67C23A;
  font-weight: bold;
}

.error {
  color: #F56C6C;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.verify-container {
  position: relative;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.verify-item * {
  margin: 2px 0;
}
.verify-item .click-anim{
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 5px;
}
.verify-item .can-select{
  user-select: text;
}
.verify-item .click-anim:hover{
  transform: scale(1.05);
}
.verify-item .click-anim:active{
  background-color: #8b7d6d;
  color: #fff;
}
/* 步骤切换动画 */
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.5s ease;
}

.step-transition-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.step-transition-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.step-transition-enter-to,
.step-transition-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.verify-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.signature-operate{
  display: flex;
  align-items: flex-end;
}
.signature-operate-item{
  margin-left: 10px; 
  display: grid; 
  grid-template-columns: repeat(2, 2fr); 
  gap: 5px; 
  margin-top: 10px; 
  height: 80px;
}
</style>
