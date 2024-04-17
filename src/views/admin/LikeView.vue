<template>
    <div class="like" :class="isDark ? 'dark' : ''">
        <h2>喜爱管理</h2>
        <div style="height: 10px"></div>
        <el-button type="primary" @click="onAdd()" plain>添加</el-button>
        <div style="height: 10px"></div>
        <el-table :data="topics" :class="isDark ? 'dark' : ''">
            <el-table-column label="主题id" prop="id" width="80"/>
            <el-table-column label="标题" prop="title"/>
            <el-table-column label="分类" prop="label"/>
            <el-table-column label="用户" prop="user"/>
            <el-table-column label="点赞" prop="like"/>
            <el-table-column label="踩" prop="dislike"/>
            <el-table-column width="200" align="center">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="primary" @click="onEdit(row)" plain>编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="addPage" :width="600" title="添加点赞信息" :close-on-click-modal="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-form inline>
                <el-form-item label="主题id">
                    <el-select v-model="like.topicId" style="width: 500px;">
                        <el-option label="1" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户">
                    <el-select v-model="like.user" style="width: 200px;">
                        <el-option label="admin" value="admin"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="喜爱">
                    <el-select v-model="like.like" style="width: 200px;">
                        <el-option label="喜爱" value="1"></el-option>
                        <el-option label="踩" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="clear()" plain>取 消</el-button>
                <el-button type="primary" @click="confirm()" plain>确 定</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="editPage" width="400" title="修改点赞信息" :close-on-click-modal="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-table :data="likeList" max-height="500" :class="isDark ? 'dark' : ''">
                <el-table-column prop="user">
                    <template #default="{row}">
                        {{ row.name }}({{ row.user }})
                    </template>
                </el-table-column>
                <el-table-column align="right">
                    <template #default="{row}">
                        <el-button type="primary" @click="onEditLike()" v-show="row.like == 2" plain>改赞</el-button>
                        <el-button type="danger" @click="onEditLike()" v-show="row.like == 1" plain>改踩</el-button>
                        <el-button type="info" @click="onEditLike()" plain>改无</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
        </el-dialog>
    </div>
</template>
<script setup>
import {inject,reactive, ref} from 'vue'
const isDark = inject('isDark')
const collapse = ref()
const topics = ref([
    {
        id:1,
        title:'这是第一条主题',
        label: 'Vue',
        user: 'admin',
        like: 0,
        dislike: 0
    },{
        id:2,
        title:'这是第一条主题2222222',
        label: 'Vue',
        user: 'admin',
        like: 0,
        dislike: 0
    }
])
const change = (e)=>{
    console.log(e)
}
const likeList = ref([
    {
        topicId: 1,
        user: 'admin',
        name: 'admin',
        like: 1
    },
    {
        topicId: 1,
        user: 'admin',
        name: 'admin',
        like: 2
    }
])
const editPage = ref(false)
const onEdit = (i)=>{
    editPage.value = true
    if(e == 1){

    }
    else{

    }
}
const like = reactive({
    topicId: 1,
    user: 'admin',
    like: '1'
})
const addPage = ref(false)
const onAdd = ()=>{
    addPage.value = true
}
const confirm = ()=>{
    console.log(like)
}
const clear = ()=>{
    addPage.value = false
}
</script>
<style scoped>
.like{
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