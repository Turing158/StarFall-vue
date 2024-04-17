<template>
    <div class="topic" :class="isDark ? 'dark' : ''">
        <h2>主题列表</h2>
        <div style="height: 10px"></div>
        <el-button type="primary" @click="openDialog(0)" plain >添加</el-button>
        <el-table :data="topics" :class="isDark ? 'dark' : ''" style="">
            <el-table-column label="id" prop="id" width="80"/>
            <el-table-column label="标题" prop="title" width="600"/>
            <el-table-column label="分类" prop="label"/>
            <el-table-column label="所属用户" prop="user"/> 
            <el-table-column label="发布日期" prop="date" width="150"/>
            <el-table-column label="浏览" prop="view"/>
            <el-table-column label="评论" prop="comment"/>
            <el-table-column label="版本" prop="version" width="150"/>
            <el-table-column width="250" align="center" fixed="right">
                <template #header>
                    <el-input :class="isDark? 'dark':''" v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="warning" @click="look(row)" plain>查看</el-button>
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
        
        <el-dialog v-model="dialog" align-center :title="dialogTitle" :width="800" :close-on-click-modal="false" :show-close="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <div class="dialog" >
                <el-form inline>
                    <el-form-item label="id">
                        <el-input v-model="topic.id" type="number" style="width: 300px;" placeholder="请输入主题id[0为自动分配]"></el-input>
                    </el-form-item>
                    <el-form-item label="语言">
                        <el-input v-model="topic.language" style="width: 320px;" placeholder="请输入适用语言"></el-input>
                    </el-form-item>
                </el-form>
                <el-form>
                    <el-form-item label="主标题">
                        <el-input v-model="topic.title" style="width: 660px;" placeholder="请输入主标题"></el-input>
                    </el-form-item>
                </el-form>
                <el-form inline>
                    <el-form-item label="标题">
                        <el-input v-model="topic.topicTitle" placeholder="请输入标题" ></el-input>
                    </el-form-item>
                    <el-form-item label="英文标题">
                        <el-input v-model="topic.enTitle" placeholder="请输入英文标题"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select style="width: 120px;" v-model="topic.label" placeholder="选择分类">
                            <el-option v-for="item in topicLabel" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form inline>
                    <el-form-item label="发布日期">
                        <el-date-picker type="date" v-model="topic.date" placeholder="请选择发布日期"  format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="浏览">
                        <el-input type="number" style="width: 100px;" v-model="topic.view" placeholder="请输入浏览量"></el-input>
                    </el-form-item>
                    <el-form-item label="用户">
                        <el-select style="width: 200px;" v-model="topic.user" placeholder="请选择用户">
                            <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user" >
                                <span style="float: left">{{ item.user }}</span>
                                <span
                                    style="
                                    float: right;
                                    color: var(--el-text-color-secondary);
                                    font-size: 12px;
                                    "
                                    >{{ item.name }}</span
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form inline>
                    <el-form-item label="版本">
                        <el-input v-model="topic.version" placeholder="请输入适用版本"></el-input>
                    </el-form-item>
                    <el-form-item label="作者">
                        <el-input v-model="topic.author" placeholder="请输入作者[转载专用]"></el-input>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select  style="width: 160px;" placeholder="请输入来源" >
                            <el-option label="原创" value="原创"></el-option>
                            <el-option label="转载" value="转载"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form>
                    <el-form-item label="原帖地址">
                        <el-input v-model="topic.address" style="width: 660px;" placeholder="请输入原帖地址"></el-input>
                    </el-form-item>
                    <el-form-item label="下载地址">
                        <el-input v-model="topic.download" style="width: 660px;" placeholder="请输入下载地址"></el-input>
                    </el-form-item>
                </el-form>
                <el-form label-position="top">
                    <el-form-item label="内容">
                        <el-input v-model="topic.content" type="textarea" :rows="4" style="width: 730px;" placeholder="请输入文章内容"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button type="danger" plain @click="clear()">取 消</el-button>
                <el-button type="primary" plain @click="confirm()">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { findAllTopic } from '@/api/admin/topic';
import { findAllUsersForSelect } from '@/api/admin/user';
import { ElMessage, ElMessageBox } from 'element-plus';

import {inject, onMounted, ref} from 'vue'
const isDark = inject('isDark')
const topics = ref([])
const topic = ref({
    id:'',
    title:'',
    label: '',
    user: '',
    date: '',
    view: 0,
    version: '',
    topicTitle: '',
    enTitle: '',
    source: '',
    author: '',
    language: '',
    address: '',
    download: '',
    content: ''
})
const look = (i)=>{
    console.log(i)
}
const userSelect = ref([])
const page = ref(1)
const total = ref(0)
const handleCurrentChange = (e)=>{
    page.value = e
    getTopicList()
}
const dialogTitle = ref('添加主题')
const dialog = ref(false)
const topicLabel = ['服务端', '客户端', '模组', '插件', '材质包', '视频']
const openDialog = (e)=>{
    if(e == 0){
        dialogTitle.value = '添加主题'
    }
    else{
        dialogTitle.value = '编辑主题'
        topic.value = e
    }
    dialog.value = true
}
const confirm = ()=>{
    // if(noticeContent.value.length == 0){
    //     ElMessage.error("公告内容不能为空！")
    // }
    // else{

    // }
    console.log(topic.value);
}
const clear = ()=>{
    dialog.value = false
    topic.value = {
        id:'',
        title:'',
        label: '',
        user: '',
        date: '',
        view: 0,
        version: '',
        topicTitle: '',
        enTitle: '',
        source: '',
        author: '',
        language: '',
        address: '',
        download: '',
        content: ''
    }
}
const onDel = (i)=>{
    ElMessageBox.confirm(i.title, '确定删除该主题吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      });
}
const getTopicList = async()=>{
    await findAllTopic(page.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            topics.value = res.data.object
            total.value = res.data.num
        }
        else{
            ElMessage.error("获取主题列表失败")
        }
    }).catch(err=>{
        ElMessage.error("服务错误")
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
    getTopicList()
    getUserSelect()
}
onMounted(init)
</script>
<style scoped>
.topic{
    width: calc(100% - 40px);
    margin: 20px;
}
.dialog{
    height: 500px;
    width: 780px;
    overflow: auto;
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