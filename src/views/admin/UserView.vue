<template>
    <div class="user" :class="isDark ? 'dark' : ''">
        <h2>用户管理</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="onPage()" plain>添加</el-button>
            <span style="position: relative;font-size: 12px;float: right;top: 20px; right: 50px;">tips: 点击头像可更换头像</span>
        </div>
        <el-table :data="users" :class="isDark ? 'dark' : ''">
            <el-table-column label="用户名" prop="user" fixed/>
            <el-table-column label="昵称" prop="name" width="200"/>
            <el-table-column label="密码" prop="password"/>
            <el-table-column label="邮箱" prop="email" width="200"/>
            <el-table-column label="性别" prop="gender" width="120">
                <template #default="{row}">
                    {{ 
                        row.gender == 0 ? 
                        '隐藏' : 
                        row.gender == 1 ? 
                        '男' : 
                        row.gender == 2 ? 
                        '女' : 
                        '沃尔玛购物袋'
                    }}
                </template>
            </el-table-column>
            <el-table-column label="生日" prop="birthday" width="120"/>
            <el-table-column label="经验" prop="exp"/>
            <el-table-column label="等级" prop="level"/>
            <el-table-column label="头像" prop="avatar" align="center">
                <template #default="{row}">
                    <img :src="'../src/assets/avatar/'+row.avatar" style="width: 40px; height: 40px; border-radius: 50%;border: 2px solid #999;"/>
                    <input type="file" class="selectImg"/>
                </template>
            </el-table-column>
            <el-table-column width="200" align="center" fixed="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="primary" plain @click="onPage(row)" >编辑</el-button>
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
            :total="total"/>
        </div>
        <el-dialog v-model="infoPage" width="600" :close-on-click-modal="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-form inline>
                <el-form-item label="用户名">
                    <el-input v-model="user.user" style="width: 185px;"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="user.name" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="user.password" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="user.email" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="user.gender" style="width: 200px;">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker v-model="user.birthday" type="date" style="width: 200px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="经验">
                    <el-input v-model="user.exp" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="等级">
                    <el-input v-model="user.level" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="user.role" style="width: 200px;">
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
    </div>
</template>
<script setup>
import { findAllUser } from '@/api/admin/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import {inject,onMounted,reactive, ref} from 'vue'
const isDark = inject('isDark')
const users = ref([])


const page = ref(1)
const total = ref(0)
const handleCurrentChange = (e)=>{
    page.value = e
    getUserList()
}


const user = reactive({
        user: '',
        password: '',
        email: '',
        name : '',
        gender: 0,
        birthday: '',
        exp: 0,
        level: 0,
        role: ''
})
const model = ref('')
const infoPage = ref(false)
const onPage = (e) => {
    if(e === null){
        // 添加
        model.value = 'add'
    }
    else{
        model.value = 'edit'
        // 修改
    }
    infoPage.value = true
}
const onDel = (i) => {
    ElMessageBox.confirm(i.name+'('+i.user+')', '确定删除该用户吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      });
}
const clear = ()=>{
    user.value = {
        user: '',
        password: '',
        email: '',
        name : '',
        gender: 0,
        birthday: '',
        exp: 0,
        level: 0
    }
    infoPage.value = false
}
const confirm = ()=>{
    if(user.user.length === 0){
        ElMessage.error('用户名不能为空')
    }
    else if(user.password.length === 0){
        ElMessage.error('密码不能为空')
    }
    else if(user.name.length === 0){
        ElMessage.error('昵称不能为空')
    }
    else if(user.email.length === 0){
        ElMessage.error('邮箱不能为空')
    }
    else if(user.birthday.length === 0){
        ElMessage.error('生日不能为空')
    }
    else{
        ElMessage.success('操作成功')
        if(model.value === 'add'){
            // 添加
        }
        else{
            // 修改
        }
        clear()
    }
    
}
const setttingAvatar = ref()
const getUserList = async()=>{
    await findAllUser(page.value).then(res=>{
        users.value = res.data.object
        total.value = res.data.num
    }).catch(err=>{
        ElMessage.error('获取用户列表失败')
    })
}
const init = () =>{
    getUserList()
}
onMounted(init)
</script>
<style scoped>
.user{
    width: calc(100% - 40px);
    margin: 20px;
}
.selectImg{
    position: absolute;
    top: 0;
    left: 0;
    width: 45px;
    height: 45px;
    background-color: #222;
    margin-top: 8px;
    margin-left: 18px;
    border-radius: 50%;
    opacity: 0;
    cursor: pointer;
}
.selectImg::-webkit-file-upload-button{
    display: none;
}
.page{
    margin-top: 20px;
    display: flex;
    justify-content: end;
}
.dark{
    --el-table-tr-bg-color: #2b2b2b;
    --el-table-row-hover-bg-color: #444;
    color: #dedede;
    --el-table-header-text-color:#dedede;
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
}
</style>