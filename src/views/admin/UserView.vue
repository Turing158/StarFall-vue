<template>
    <div class="user" :class="isDark ? 'dark' : ''">
        <h2>用户管理</h2>
        <div style="height: 10px"></div>
        <el-button type="primary" @click="onPage()" plain>添加</el-button>
        <el-table :data="users" :class="isDark ? 'dark' : ''">
            <el-table-column label="用户名" prop="user" width="80"/>
            <el-table-column label="昵称" prop="name"/> 
            <el-table-column label="密码" prop="password"/>
            <el-table-column label="邮箱" prop="email"/>
            <el-table-column label="性别" prop="gender">
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
            <el-table-column label="生日" prop="birthday"/>
            <el-table-column label="经验" prop="exp"/>
            <el-table-column label="等级" prop="level"/>
            <el-table-column label="头像" prop="avatar"/>
            <el-table-column width="300" align="center">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="primary" plain @click="onPage(row)" >编辑</el-button>
                    <el-button type="danger" plain @click="onDel(row)">删除</el-button>
                    <el-button type="warning" plain @click="setttingAvatar()">修改头像</el-button>
                </template>
            </el-table-column>
        </el-table>
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
                <el-button @click="clear()" plain>取 消</el-button>
                <el-button type="primary" @click="confirm()" plain>确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import {inject,reactive, ref} from 'vue'
const isDark = inject('isDark')
const users = ref([
    {
        user: 'admin',
        password: '***',
        email: '',
        name : 'admin',
        gender: 3,
        birthday: '2021-10-01',
        exp: 100,
        level: 10,
        avatar: 'default.png',
        role: ''
    }
])
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
</script>
<style scoped>
.user{
    width: calc(100% - 40px);
    margin: 20px;
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