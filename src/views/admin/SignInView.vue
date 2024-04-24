<template>
    <div class="sign"  :class="isDark ? 'dark' : ''">
        <h2>签到列表</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="openDialog(0)" plain>添加</el-button>
        </div>
        <el-table :data="signIns" :class="isDark ? 'dark' : ''">
            <el-table-column label="用户" prop="user" width="80"/>
            <el-table-column label="昵称" prop="name"/>
            <el-table-column label="签到日期" prop="date"/>
            <el-table-column label="日志" prop="message"/>
            <el-table-column label="心情" prop="emotion"/>
            <el-table-column width="200" align="center">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="primary" @click="openDialog(row)" plain>编辑</el-button>
                    <el-button type="danger" @click="onDel(row)" plain>删除</el-button>
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
        <el-dialog width="300" v-model="editPage" :title="dialogTitle" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-form ref="formInput" inline :rules="rules" :model="signIn">
                <el-form-item label="用户" prop="user">
                    <el-select style="width: 200px;" v-model="signIn.user" placeholder="请选择用户" :disabled="disabled">
                        <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user" >
                            <span style="float: left">{{ item.user }}</span>
                            <span
                                style="
                                position: relative;
                                float: right;
                                right: -25px;
                                color: var(--el-text-color-secondary);
                                font-size: 12px;
                                "
                                >{{ item.name }}</span
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签到日期" prop="date">
                        <el-date-picker type="date" v-model="signIn.date" placeholder="请选择签到日期" style="width: 200px;" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled="disabled"></el-date-picker>
                    </el-form-item>
                <el-form-item label="日志" prop="message">
                    <el-input v-model="signIn.message" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="心情" prop="emotion">
                    <el-select placeholder="选择心情" v-model="signIn.emotion" style="width: 200px;">
                        <el-option label="😊开心😊" value="开心"/>
                        <el-option label="😭伤心😭" value="伤心"/>
                        <el-option label="🫤无聊🫤" value="无聊"/>
                        <el-option label="🫤郁闷🫤" value="郁闷"/>
                        <el-option label="🙃忙碌🙃" value="忙碌"/>
                        <el-option label="😶无语😶" value="无语"/>
                        <el-option label="😫难受😫" value="难受"/>
                        <el-option label="🥱困倦🥱" value="困倦"/>
                        <el-option label="😖紧张😖" value="紧张"/>
                        <el-option label="😏得意😏" value="得意"/>
                        <el-option label="😦惊讶😦" value="惊讶"/>
                        <el-option label="🤒生病🤒" value="生病"/>
                        <el-option label="🤡小丑🤡" value="小丑"/>
                        <el-option label="🤬暴怒🤬" value="暴怒"/>
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

import { appendSignIn, deleteSignIn, findAllSignIn, findAllUsersForSelect, updateSignIn } from '@/api/admin/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { inject, onMounted, reactive, ref } from 'vue';
const isDark = inject('isDark')

const signIns = ref([])
const userSelect = ref([])

const signIn = ref({
    user: '',
    date: '',
    message: '',
    emotion: ''
})

const rules = reactive({
    user: [
        { required: true, message: '请选择用户', trigger: 'blur' }
    ],
    date: [
        { required: true, message: '请选择日期', trigger: 'blur' }
    ],
    message: [
        { required: true, message: '请输入日志', trigger: 'blur' }
    ],
    emotion: [
        { required: true, message: '请选择心情', trigger: 'blur' }
    ]
})

const total = ref(0)
const page = ref(1)
const search = ref('')
const handleCurrentChange = (e)=>{
    page.value = e
    getSignInList()
}

const dialogTitle = ref('')
const editPage = ref(false)
const formInput = ref()
const disabled = ref(false)
const openDialog = (e)=>{
    if(e == 0){
        dialogTitle.value = '添加签到'
        disabled.value = false
    }
    else{
        dialogTitle.value = '编辑签到'
        disabled.value = true
        signIn.value = {
            user: e.user,
            date: e.date,
            message: e.message,
            emotion: e.emotion
        
        }
    }
    editPage.value = true
}
const onDel = (row)=>{
    ElMessageBox.confirm('确定删除'+row.name+'('+row.user+')在'+row.date+'的签到吗?', '删除签到', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteSignIn(row).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("删除成功！")
                getSignInList()
            }
            else if(msg == 'SIGN_IN_NOT_EXIST'){
                ElMessage.error("签到记录不存在！")
            }
            else{
                ElMessage.error("删除失败！")
            }
        }).catch(err=>{
            ElMessage.error("服务异常")
        
        })
      }).catch(() => {
        ElMessage.info('已取消删除')
      });
}
const clear = ()=>{
    editPage.value = false
    signIn.value = {
        user: '',
        date: '',
        message: '',
        emotion: ''
    }
}
const confirm = ()=>{
    formInput.value.validate((valid)=>{
        if(valid){
            if(dialogTitle.value == '添加签到'){
                addSignIn()
            }
            else{
                editSignIn()
            }
        }
    })
}
const addSignIn = async()=>{
    formInput.value.validate(async(valid)=>{
        if(valid){
            await appendSignIn(signIn.value).then(res=>{
                let msg = res.data.msg
                if(msg == 'SUCCESS'){
                    ElMessage.success('添加成功')
                    clear()
                    getSignInList()
                }
                else if(msg == 'SIGN_IN_EXIST'){
                    ElMessage.error('该用户已存在签到记录')
                }
                else{
                    ElMessage.error('添加失败')
                }
            }).catch(err=>{
                ElMessage.error('服务异常')
            })
        }
    })
}
const editSignIn = async()=>{
    formInput.value.validate(async(valid)=>{
        if(valid){
            await updateSignIn(signIn.value).then(res=>{
                let msg = res.data.msg
                if(msg == 'SUCCESS'){
                    ElMessage.success('修改成功')
                    clear()
                    getSignInList()
                }
                else{
                    ElMessage.error('修改失败')
                }
            }).catch(err=>{
                ElMessage.error('服务异常')
            })
        }
    })
}

const getSignInList = async()=>{
    await findAllSignIn(page.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            signIns.value = res.data.object
            total.value = res.data.num
        }
    }).catch(err=>{
        ElMessage.error('服务异常')
    })
}
const getUserSelect = async()=>{
    await findAllUsersForSelect().then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            userSelect.value = res.data.object
        }
    }).catch(err=>{
        ElMessage.error("服务错误")
    
    })
}
const init = ()=>{
    getSignInList()
    getUserSelect()
}
onMounted(init)
</script>
<style scoped>
.sign{
    width: calc(100% - 40px);
    margin: 20px;
}
.page{
    margin-top: 20px;
    display: flex;
    justify-content: end;
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
  --el-text-color-placeholder: #888;
  --el-fill-color-light: #222;
  --el-fill-color: #2b2b2b;
  --el-disabled-border-color: #444;
  --el-disabled-bg-color: #222;
  --el-text-color-primary: #888;
}
</style>