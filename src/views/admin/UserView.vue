<template>
  <div class="user" :class="isDark ? 'dark' : ''">
    <h2>用户管理</h2>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="onPage(null)" plain>添加</el-button>
      <span style="position: relative; font-size: 12px; float: right; top: 20px; right: 50px"
        >tips: 点击头像可更换头像</span
      >
    </div>
    <input style="display: none;" ref="fileInput" type="file" accept="image/jpeg, image/png, image/jpg"/>
    <el-table :data="users" :class="isDark ? 'dark' : ''">
      <el-table-column label="用户名" prop="user" fixed width="180" />
      <el-table-column label="昵称" prop="name" width="200" />
      <el-table-column label="密码" prop="password" />
      <el-table-column label="邮箱" prop="email" width="200" />
      <el-table-column label="性别" prop="gender" width="120">
        <template #default="{ row }">
          {{
            row.gender == 0
              ? '隐藏'
              : row.gender == 1
                ? '男'
                : row.gender == 2
                  ? '女'
                  : '沃尔玛购物袋'
          }}
        </template>
      </el-table-column>
      <el-table-column label="生日" prop="birthday" width="120" />
      <el-table-column label="经验" prop="exp" />
      <el-table-column label="等级" prop="level" />
      <el-table-column label="头像" prop="avatar" width="80" align="center">
        <template #default="{ row }">
          <div>
            <img
              :src="'../src/assets/avatar/' + row.avatar"
              style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #999"
            />
            <div class="avatarMenu">
              <el-dropdown class="dropmenu" trigger="click">
                <span class="el-dropdown-link">
                  Dropdown
                  <br />
                  <br />
                  <br />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="avatarSelect(row.user,0)">设为默认</el-dropdown-item>
                    <el-dropdown-item @click="avatarSelect(row.user,1)">修改头像</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="role" align="center">
        <template #default="{ row }">
          {{ row.role == 'admin' ? '管理员' : '普通用户' }}
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" fixed="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="{ row }">
          <el-button type="primary" plain @click="onPage(row)">编辑</el-button>
          <el-button type="danger" plain @click="onDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="10"
        layout="total, prev, pager, next"
        background
        :total="total"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      v-model="infoPage"
      width="600"
      :close-on-click-modal="false"
      :style="{
        '--el-dialog-bg-color': isDark ? '#2b2b2b' : '#fff',
        '--el-text-color-primary': isDark ? '#dedede' : '#131313'
      }"
    >
      <el-form ref="formInput" inline :rules="rules" :model="user">
        <el-form-item label="用户名" prop="user">
          <el-input v-model="user.user" style="width: 185px" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="user.name" style="width: 200px" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="user.password"
            style="width: 200px"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" style="width: 200px" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="user.gender" style="width: 200px" placeholder="请选择性别">
            <el-option label="隐藏" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
            <el-option label="沃尔玛购物袋" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="user.birthday"
            type="date"
            style="width: 200px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="经验" prop="exp">
          <el-input
            type="number"
            v-model="user.exp"
            style="width: 200px"
            placeholder="请输入经验"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input
            type="number"
            v-model="user.level"
            style="width: 200px"
            placeholder="请输入等级"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="user.role" style="width: 200px" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="clear()" plain>取 消</el-button>
        <el-button type="primary" @click="confirm()" plain>确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="裁剪头像" v-model="setAvatarPage" width="600" :close-on-click-modal="false" @close="cancle()">
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
            <div class="previewChild" :style="{ scale: 100 / preview.h }">
              <div v-html="preview.html"></div>
            </div>
          </div>
          <Empty :height="20" />
          <el-button type="primary" :width="100" @click="cropper.rotateRight()" plain>顺时针旋转90°</el-button>
          <Empty :height="10" />
          <el-button type="primary" :width="100" @click="cropper.rotateLeft()" plain>逆时针旋转90°</el-button>
          <Empty :height="10" />
          <el-button type="success" :width="100" @click="onclip()" plain>确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import Empty from '@/components/FitEmpty.vue'
import { deleteUser, findAllUser, insertUser, updateAvatar, updateUser } from '@/api/admin/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { inject, onMounted, reactive, ref } from 'vue'
const isDark = inject('isDark')
const users = ref([])

const page = ref(1)
const total = ref(0)
const handleCurrentChange = (e) => {
  page.value = e
  getUserList()
}
const search = ref('')

const user = ref({
  user: '',
  password: '',
  email: '',
  name: '',
  gender: 0,
  birthday: '',
  exp: 0,
  level: 0,
  role: ''
})
const oldUser = ref('')
const oldEmail = ref('')
const formInput = ref()
const rules = reactive({
  user: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }],
  exp: [{ required: true, message: '请输入经验值', trigger: 'blur' }],
  level: [{ required: true, message: '请输入等级', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
})

const model = ref('')
const dialogTitle = ref('')
const infoPage = ref(false)
const onPage = (e) => {
  if (e === null) {
    // 添加
    model.value = 'add'
    dialogTitle.value = '添加用户'
  } else {
    user.value = {
      user: e.user,
      password: '',
      email: e.email,
      name: e.name,
      gender: e.gender,
      birthday: e.birthday,
      exp: e.exp,
      level: e.level,
      role: e.role
    }
    oldUser.value = e.user
    oldEmail.value = e.email
    model.value = 'edit'
    dialogTitle.value = '编辑用户'
  }
  infoPage.value = true
}
const onDel = (i) => {
  ElMessageBox.confirm(i.name + '(' + i.user + ')', '确定删除该用户吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(i.user)
        .then((res) => {
          let msg = res.data.msg
          if (msg == 'SUCCESS') {
            ElMessage.success('删除成功')
            getUserList()
          } else if (msg == 'USER_NOT_EXIST') {
            ElMessage.error('该用户不存在，你在搞事情吗？')
          } else {
            ElMessage.error('删除失败')
          }
        })
        .catch((err) => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const clear = () => {
  infoPage.value = false
  oldUser.value = ''
  user.value = {
    user: '',
    password: '',
    email: '',
    name: '',
    gender: 0,
    birthday: '',
    exp: 0,
    level: 0,
    role: ''
  }
}

const confirm = () => {
  formInput.value.validate((valid) => {
    if (valid) {
      if (model.value == 'add') {
        addUser()
      } else {
        editUser()
      }
    }
  })
}
const addUser = async () => {
  await insertUser(user.value)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        ElMessage.success('添加成功')
        getUserList()
        clear()
      } else if (msg == 'USER_EXIST') {
        ElMessage.error('该用户名已存在')
      } else if (msg == 'EMAIL_EXIST') {
        ElMessage.error('该邮箱已存在')
      } else {
        ElMessage.error('添加失败')
      }
    })
    .catch((err) => {
      ElMessage.error('添加失败')
    })
}
const editUser = async () => {
  let obj = {
    user: {
      user: user.value.user,
      password: user.value.password,
      email: user.value.email,
      name: user.value.name,
      gender: user.value.gender,
      birthday: user.value.birthday,
      exp: user.value.exp,
      level: user.value.level,
      role: user.value.role
    },
    oldUser: oldUser.value,
    oldEmail: oldEmail.value
  }
  await updateUser(obj)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        ElMessage.success('修改成功')
        getUserList()
        clear()
      } else if (msg == 'USER_NOT_EXIST') {
        ElMessage.error('该用户不存在，你在搞事情吗？')
      } else if (msg == 'USER_EXIST') {
        ElMessage.error('该用户名已存在')
      } else if (msg == 'EMAIL_EXIST') {
        ElMessage.error('该邮箱已存在')
      } else {
        ElMessage.error('修改失败')
      }
    })
    .catch((err) => {
      ElMessage.error('修改失败')
    })
}




const avatarSelectingUSer = ref('')
const selectDefault = async(user)=>{
  await updateAvatar(user,"default.png").then(res=>{
    if(res.data.msg == 'SUCCESS'){
      getUserList()
      ElMessage.success('设置默认头像成功')
    }
    else{
      ElMessage.error('设置默认头像失败')
    }
  }).catch(err=>{
    ElMessage.error('设置默认头像失败')
  })
}
const avatarSelect = (user,e) => {
  avatarSelectingUSer.value = user
  if(e == 0){
    selectDefault(user)
  }
  else{
    fileInput.value.click()
  }
}
const cropper = ref()
const avatar = ref('')
const fileInput = ref()
const setAvatarPage = ref(false)
const confirmAvatar = async () => {
  if (avatar.value == '') {
    ElMessage.error('请先选择图片')
  } else {
    await updateAvatar(avatarSelectingUSer.value,avatar.value).then(res=>{
      if(res.data.msg == 'SUCCESS'){
        getUserList()
        ElMessage.success('修改头像成功')
      }
      else{
        ElMessage.error('修改头像失败')
      }
    }).catch(err=>{
      ElMessage.error('修改头像失败')
    })
  }
  fileInput.value.value = ''
  avatar.value = ''
}
const option = reactive({
  outputSize: 1, // 裁剪生成图片的质量
  outputType: 'png', // 裁剪生成图片的格式
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
const onclip = () => {
  cropper.value.getCropData((data) => {
    avatar.value = data
    setAvatarPage.value = false
    confirmAvatar()
  })
}
const cancle = ()=>{
  setAvatarPage.value = false
  avatarSelectingUSer.value = ''
}




const getUserList = async () => {
  await findAllUser(page.value)
    .then((res) => {
      users.value = res.data.object
      total.value = res.data.num
    })
    .catch((err) => {
      ElMessage.error('获取用户列表失败')
    })
}
const initInput = ()=>{
  fileInput.value.addEventListener('change', function () {
    let fileInputValue = fileInput.value
    // 清除背景图片:
    if (!fileInputValue.value) {
      fileInputValue.value = ''
      return
    }
    let file = fileInputValue.files[0]
    let size = file.size
    if (size >= 5 * 1024 * 1024) {
      fileInputValue.value = ''
      ElMessage.error('文件大小超出限制(5MB)')
      return false
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      fileInputValue.value = ''
      ElMessage.error('不是有效的图片文件!')
      return
    }
    // 读取文件:
    let reader = new FileReader()
    reader.onload = function (e) {
      let data = e.target.result
      avatar.value = data
      setAvatarPage.value = true
    }
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(file)
  })
}
const init = () => {
  getUserList()
  initInput()
}
onMounted(init)
</script>
<style scoped>
.user {
  width: calc(100% - 40px);
  margin: 20px;
}
.avatarMenu {
  position: absolute;
  width: 45px;
  height: 45px;
  margin-top: -50px;
  margin-left: 5px;
  background-color: #222;
  border-radius: 50%;
  cursor: pointer;
  background-color: #111;
  overflow: hidden;
  opacity: 0;
}
.avatarMenu .dropmenu {
  left: -12px;
}
.page {
  margin-top: 20px;
  display: flex;
  justify-content: end;
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
  transition: all 0.2s;
  overflow: hidden;
}
.preview:hover{
  border-radius: 50%;
}
.previewChild{
  width: 100px;
  transform-origin: 0 0;
}
.dark {
  --el-table-tr-bg-color: #2b2b2b;
  --el-table-row-hover-bg-color: #444;
  color: #dedede;
  --el-table-header-text-color: #dedede;
  --el-table-header-bg-color: #222;
  --el-table-border-color: #444;
  --el-input-border-color: #444;
  --el-input-bg-color: #2b2b2b;
  --el-input-text-color: #dedede;
  --el-text-color-primary: #eee;
  --el-text-color-regular: #eee;
  --el-fill-color-blank: #2b2b2b;
  --el-border-color: #444;
  --el-pagination-button-bg-color: #2b2b2b;
  --el-disabled-bg-color: #444;
  --el-color-primary-light-9: #444;
  --el-color-warning-light-9: #444;
  --el-color-success-light-9: #444;
  --el-color-danger-light-9: #444;
  --el-text-color-primary: #444;
  --el-fill-color: ##2b2b2b;
}
</style>
