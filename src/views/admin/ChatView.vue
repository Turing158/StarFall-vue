<template>
    <div class="chat"  :class="isDark ? 'dark' : ''">
        <h2>聊天记录列表</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="openDialog(0)" plain>添加</el-button>
            <span style="position: relative; font-size: 12px; float: right; top: 20px; right: 50px"
                >tips: [&amp;divide&]为聊天分割符，用于区分同一时间段的多条消息</span
            >
        </div>
        <el-table :data="chats" :class="isDark ? 'dark' : ''">
            <el-table-column label="发送方 ->" prop="fromUser" width="180">
                <template #default="{row}">
                    <span>{{row.fromName}}({{ row.fromUser }})</span>
                </template>
            </el-table-column>
            <el-table-column label=" ->接收方" prop="toUser" width="180">
                <template #default="{row}">
                    <span>{{row.toName}}({{ row.toUser }})</span>
                </template>
            </el-table-column>
            <el-table-column label="发送日期" prop="date" width="180"/>
            <el-table-column label="聊天内容" prop="content"  min-width="400"/>
            <el-table-column width="200" align="center" fixed="right">
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
        <el-dialog v-model="editPage" width="600" :title="dialogTitle" :show-close="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}" :close-on-click-modal="false">
            <div class="dialogContent">
                <el-form ref="formInput" inline label-position="top" :rules="rules" :model="chat">
                    <el-form-item label="发送方" prop="fromUser">
                        <el-select style="width: 200px;" v-model="chat.fromUser" placeholder="请选择发送用户">
                                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user" :disabled="chat.toUser == item.user">
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
                    <el-form-item style="width: 50px;">
                        <div style="display: flex;flex-direction: column;cursor: pointer;" @click="changeAnother()">
                            <p style="position: relative;font-size: 12px;top: 10px;">互换</p>
                            <span style="position: relative;font-size: 20px;top: -10px;left: -5px;">----&gt;</span>
                        </div>
                        
                    </el-form-item>
                    <el-form-item label="接收方" prop="toUser">
                        <el-select style="width: 200px;" v-model="chat.toUser" placeholder="请选择接收用户">
                                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user" :disabled="chat.fromUser == item.user">
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
                    <el-form-item label="发布日期" prop="date">
                        <el-date-picker type="datetime" v-model="chat.date" placeholder="请选择聊天记录日期" style="width: 200px;" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="聊天内容" prop="content">
                        <el-input type="textarea" maxlength="300" style="width: 520px;" :rows="3" v-model="chat.content"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="clear()" type="danger" plain>取 消</el-button>
                <el-button type="primary" @click="confirm()" plain>确 定</el-button>
            </template>
        </el-dialog>

    </div>
</template>
<script setup>
import { deleteMessage, findAllMessage, insertMessage, updateMessage } from '@/api/admin/message';
import { findAllUsersForSelect } from '@/api/admin/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import {inject, onMounted, ref} from 'vue'
const isDark = inject('isDark')
const search = ref('')
const chats = ref([])


const chat = ref({
    fromUser: '',
    toUser: '',
    date: '',
    content: ''
})
const oldChat = ref()
const userSelect = ref([])
const rules = ref({
    fromUser: [
        { required: true, message: '发送用户不能为空', trigger: 'blur' }
    ],
    toUser: [
        { required: true, message: '接收用户不能为空', trigger: 'blur' }
    ],
    date: [
        { required: true, message: '发送日期不能为空', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '聊天内容不能为空', trigger: 'blur' }
    ]
})

const total = ref(0)
const page = ref(1)
const handleCurrentChange = (e)=>{
    page.value = e
    getChatList()
}

const dialogTitle = ref('')
const editPage = ref(false)
const openDialog = (e)=>{
    if(e == 0){
        dialogTitle.value = '添加聊天记录'
    }
    else{
        dialogTitle.value = '编辑聊天记录'
        chat.value = {
            fromUser: e.fromUser,
            toUser: e.toUser,
            date: e.date,
            content: e.content
        }
        oldChat.value = {
            fromUser: e.fromUser,
            toUser: e.toUser,
            date: e.date,
            content: e.content
        }
    }
    editPage.value = true
}
const changeAnother = ()=>{
    let tmp = chat.value.fromUser
    chat.value.fromUser = chat.value.toUser
    chat.value.toUser = tmp
}
const formInput = ref()
const confirm = async()=>{
    if(dialogTitle.value == '添加聊天记录'){
        addChat()
    }
    else{
        editChat()
    }
}
const addChat = ()=>{
    formInput.value.validate(async(valid)=>{
        if(valid){
            await insertMessage(chat.value).then(res=>{
                let msg = res.data.msg
                if(msg == 'SUCCESS'){
                    ElMessage.success("添加成功！")
                    clear()
                    getChatList()
                }
                else if(msg == 'MESSAGE_EXIST'){
                    ElMessage.error("聊天记录已存在！")
                }
                else{
                    ElMessage.error("添加失败！")
                }
            }).catch(err=>{
                ElMessage.error("服务异常")
            })
        }
    })
}
const editChat = ()=>{
    formInput.value.validate(async(valid)=>{
        if(valid){
            if(oldChat.value.fromUser == chat.value.fromUser && oldChat.value.toUser == chat.value.toUser && oldChat.value.date == chat.value.date && oldChat.value.content == chat.value.content){
                ElMessage.warning("聊天记录未修改！")
                return
            }
            let msgs = {
                oldMessage: oldChat.value,
                newMessage: chat.value
            }
            await updateMessage(msgs).then(res=>{
                let msg = res.data.msg
                if(msg == 'SUCCESS'){
                    ElMessage.success("修改成功！")
                    clear()
                    getChatList()
                }
                else if(msg == 'MESSAGE_NOT_EXIST'){
                    ElMessage.error("聊天记录不存在！")
                }
                else{
                    ElMessage.error("修改失败！")
                }
            }).catch(err=>{
                ElMessage.error("服务异常")
            
            })
        }
    })
}
const clear = ()=>{
    editPage.value = false
    chat.value = {
        fromUser: '',
        toUser: '',
        date: '',
        content: ''
    }
    oldChat.value = {
        fromUser: '',
        toUser: '',
        date: '',
        content: ''
    }
}
const onDel = (i)=>{
    ElMessageBox.confirm("正在操作删除"+i.fromName+"("+i.fromUser+")在"+i.date+"发送给"+i.toName+"("+i.toUser+")的聊天消息吗", '确定删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteMessage(i).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("删除成功！")
                getChatList()
            }
            else if(msg == 'MESSAGE_NOT_EXIST'){
                    ElMessage.error("聊天记录不存在！")
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
const getChatList = async()=>{
    await findAllMessage(page.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            chats.value = res.data.object
            total.value = res.data.num
        }
        else{
            ElMessage.error("获取聊天记录失败！")
        }
    }).catch(err=>{
        ElMessage.error("服务异常")
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
    getChatList()
    getUserSelect()
}
onMounted(init)
</script>
<style scoped>
.chat{
    width: calc(100% - 40px);
    margin: 20px;
}
.page{
    margin-top: 20px;
    display: flex;
    justify-content: end;
}
.dialogContent{
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
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
    --el-fill-color: #2b2b2b;
    --el-disabled-bg-color: #444;
    --el-color-primary-light-9: #444;
    --el-color-warning-light-9: #444;
    --el-color-success-light-9: #444;
    --el-color-danger-light-9: #444;
    --el-text-color-primary: #888;
}
</style>