<template>
  <Book>
    <Empty :height="30" />
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
import { ElMessage, ElNotification } from 'element-plus'
import { saveInfo, settingAvatar } from '@/api/user'
import Code from '@/components/Code.vue'
import { useRouter } from 'vue-router';
const codeImg = ref()
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
        await saveInfo(name.value, checkGenderToValue(gender.value),birthday.value,code.value)
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
              userStore.setUserObject(data.user,data.name,data.level,data.exp,data.maxExp,data.gender,data.birthday,data.avatar,data.email)
              name.value = data.name,
              gender.value = checkGenderToLabel(data.gender)
              birthday.value = data.birthday
              ElNotification({
                title: '保存成功',
                message: '已将用户信息保存',
                type: 'success'
              })
            }
          })
          .catch((err) => {
            ElMessage.error('服务异常')
          })
          code.value = ''
          codeImg.value.changeCode()
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
const avatar = ref('/src/assets/avatar/' + userStore.avatar)
const init = ()=>{
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
  if(avatar.value == '/src/assets/avatar/' + userStore.avatar){
    ElMessage.error('请先选择图片')
  }
  else{
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
        avatar.value = '/src/assets/avatar/' + fileName
      }
      else{
        ElMessage.error('更改头像失败')

      }
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
onMounted(init)
</script>
<style scoped>
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
</style>
