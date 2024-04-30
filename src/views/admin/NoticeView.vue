<template>
    <div class="notice"  :class="isDark ? 'dark' : ''">
        <h2>公告列表</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="onAdd()" plain>添加</el-button>
        </div>
        <el-table :data="notices" :class="isDark ? 'dark' : ''">
            <el-table-column label="id" prop="id" width="80"/>
            <el-table-column label="公告内容" prop="content"/>
            <el-table-column width="200" align="center">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="primary" @click="onEdit(row)" plain>编辑</el-button>
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
        <el-dialog v-model="editPage" title="编辑公告" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-form>
                <el-form-item label="公告内容">
                    <el-input v-model="noticeContent"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="clear()" type="danger" plain>取 消</el-button>
                <el-button type="primary" @click="confirmEdit()" plain>确 定</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="addPage" title="添加公告" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-form>
                <el-form-item label="公告内容">
                    <el-input v-model="noticeContent"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="clear()" type="danger" plain>取 消</el-button>
                <el-button type="primary" @click="confirmAdd()" plain>确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { addNotice, deleteNotice, findAllNotice, updateNotice } from '@/api/admin/notice';
import { ElMessage, ElMessageBox } from 'element-plus';
import {inject, onMounted, ref} from 'vue'
const isDark = inject('isDark')
const search = ref('')
const notices = ref([])
const total = ref(0)
const page = ref(1)
const handleCurrentChange = (e)=>{
    page.value = e
    getNoticeList()
}
const noticeId = ref('')
const noticeContent = ref('')
const editPage = ref(false)
const addPage = ref(false)
const onAdd = ()=>{
    noticeContent.value = ''
    addPage.value = true
}
const confirmAdd = async()=>{
    if(noticeContent.value.length == 0){
        ElMessage.error("公告内容不能为空！")
    }
    else{
        let obj = {
            id: noticeId.value,
            content: noticeContent.value
        }
        await addNotice(obj).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("添加成功！")
                clear()
                getNoticeList()
            }
            else{
                ElMessage.error("添加失败！")
            }
        }).catch(err=>{
            ElMessage.error("服务异常")
        })
    }
}
const onEdit = (i)=>{
    editPage.value = true
    noticeId.value = i.id
    noticeContent.value = i.content
}
const confirmEdit = async()=>{
    if(noticeContent.value.length == 0){
        ElMessage.error("公告内容不能为空！")
    }
    else{
        let obj = {
            id: noticeId.value,
            content: noticeContent.value
        }
        await updateNotice(obj).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("修改成功！")
                clear()
                getNoticeList()
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error("公告不存在！")
            }
            else{
                ElMessage.error("修改失败！")
            }
        }).catch(err=>{
            ElMessage.error("服务异常")
        })
    }
}
const clear = ()=>{
    addPage.value = false
    editPage.value = false
    noticeId.value = ''
    noticeContent.value = ''
}
const onDel = (i)=>{
    ElMessageBox.confirm(i.content, '确定删除该公告吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteNotice(i.id).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("删除成功！")
                getNoticeList()
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error("公告不存在！")
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
const getNoticeList = async()=>{
    await findAllNotice(page.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            notices.value = res.data.object
            total.value = res.data.num
        }
    }).catch(err=>{
        ElMessage.error("获取公告列表失败！")
    })
}
const init = ()=>{
    getNoticeList()
}
onMounted(init)
</script>
<style scoped>
.notice{
    width: calc(100% - 40px);
    margin: 20px;
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
    --el-fill-color: #2b2b2b;
    --el-disabled-bg-color: #444;
    --el-color-primary-light-9: #444;
    --el-color-warning-light-9: #444;
    --el-color-success-light-9: #444;
    --el-color-danger-light-9: #444;
    --el-text-color-primary: #888;
}
</style>