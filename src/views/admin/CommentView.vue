<template>
    <div class="comment" :class="isDark ? 'dark' : ''">
        <h2>评论管理</h2>
        <div style="height: 10px"></div>
        <el-button type="primary" @click="openDialog(0)" plain>添加</el-button>
        <div style="height: 10px"></div>
        <el-collapse v-model="collapse" accordion @change="change" :style="{'--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-collapse-item v-for="(item,index) in topics" :key="index" :title="item.title" :name="item.id">
                <el-table :data="showComments" :class="isDark ? 'dark' : ''">
                    <el-table-column label="发布用户" prop="user" width="80"/>
                    <el-table-column label="内容" prop="content"/>
                    <el-table-column label="时间" width="200" prop="date"/>
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
            </el-collapse-item>
        </el-collapse>
        <el-dialog v-model="dialog" align-center :title="dialogTitle" :width="600" :close-on-click-modal="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <div class="dialog">
                <el-form inline>
                    <el-form-item label="主题">
                        <el-select style="width: 200px;" placeholder="请选择主题" v-model="editComment.topicId">
                            <el-option label="中文" value="zh"></el-option>
                            <el-option label="英文" value="en"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户">
                        <el-select style="width: 200px;" placeholder="请选择用户" v-model="editComment.user">
                            <el-option label="中文" value="zh"></el-option>
                            <el-option label="英文" value="en"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker v-model="editComment.date" type="date" placeholder="请选择发布日期" style="width: 200px;" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
                    </el-form-item>
                </el-form>
                <el-form label-position="top">
                    <el-form-item label="内容">
                        <el-input type="textarea" v-model="editComment.content" :rows="6" style="width: 550px;" placeholder="请输入评论内容"></el-input>
                    </el-form-item>
                </el-form>
            </div>
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
const collapse = ref()
const topics = ref([
    {
        id:1,
        title:'这是第一条主题',
        label: 'Vue',
        user: 'admin'
    },{
        id:2,
        title:'这是第一条主题2222222',
        label: 'Vue',
        user: 'admin'
    }
])
const showComments = ref([
    {
        topicId:'1',
        user: 'admin',
        content: '这是一条评论',
        date: '2021-10-10'
    }
])
const editComment = reactive({
    topicId: '',
    user: '',
    content: '',
    date: ''
})
const change = (e)=>{
    console.log(e)
}
const dialog = ref(false)
const openDialog = (e)=>{
    dialog.value = true
    if(e == 0){
        dialogTitle.value = '添加评论'
    }
    else{
        dialogTitle.value = '编辑评论'
    }
}
const confirm = ()=>{
    // if(noticeContent.value.length == 0){
    //     ElMessage.error("公告内容不能为空！")
    // }
    // else{

    // }
}
const clear = ()=>{
    dialog.value = false
}
const onDel = (i)=>{
    ElMessageBox.confirm(i.content, '确定删除该公告吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      });
}
</script>
<style scoped>
.comment{
    width: calc(100% - 40px);
    margin: 20px;
}
.dialog{
    height: 300px;
    width: 580px;
    overflow: auto;
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