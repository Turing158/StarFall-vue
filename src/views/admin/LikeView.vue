<template>
    <div class="like" :class="isDark ? 'dark' : ''">
        <h2>喜爱管理</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="onAdd()" plain>添加</el-button>
        </div>
        <el-table :data="topics" :class="isDark ? 'dark' : ''">
            <el-table-column label="主题id" prop="id" width="80"/>
            <el-table-column label="标题" prop="title" width="600"/>
            <el-table-column label="分类" prop="label"/>
            <el-table-column label="用户" prop="user"/>
            <el-table-column label="点赞" prop="like"/>
            <el-table-column label="踩" prop="dislike"/>
            <el-table-column width="120" align="center" fixed="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="{row}">
                    <el-button type="primary" @click="onEdit(row)" plain>编辑</el-button>
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
        <el-dialog v-model="addPage" :width="600" title="添加点赞信息" :close-on-click-modal="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-form ref="formInput" inline :rules="rules" :model="like">
                <el-form-item label="主题id" prop="topicId">
                    <el-select v-model="like.topicId" style="width: 500px;">
                        <el-option
                            v-for="item in topicSelect"
                            :key="item.id"
                            :label="item.id"
                            :value="item.id"
                        >
                            <span style="float: left">{{ item.id }}</span>
                            <span
                            style="
                                float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 12px;
                                margin-top: -8px;
                            "
                            >{{ item.title }}<br/><span
                            style="
                                float: right;
                                color: var(--el-text-color-secondary);
                                font-size: 12px;
                                margin-top: -18px;
                            "
                            ><span style="margin-right: 50px;">{{ item.label }}</span>{{ item.user }}</span
                            >
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户" prop="user">
                    <el-select v-model="like.user" style="width: 200px;">
                        <el-option
                            v-for="item in userSelect"
                            :key="item.user"
                            :label="item.user"
                            :value="item.user"
                        >
                            <span style="float: left">{{ item.user }}</span>
                            <span
                            style="position: relative;right: -25px;float: right; color: var(--el-text-color-secondary); font-size: 12px"
                            >{{ item.name }}</span
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="喜爱" prop="status">
                    <el-select v-model="like.status" style="width: 200px;">
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
        <el-dialog v-model="editPage" width="600" title="修改点赞信息" align-center :close-on-click-modal="false" :style="{'--el-dialog-bg-color':isDark ? '#2b2b2b' : '#fff','--el-text-color-primary':isDark ? '#dedede' : '#131313'}">
            <el-table :data="likeList" max-height="500" :class="isDark ? 'dark' : ''">
                <el-table-column label="用户" prop="user" width="250">
                    <template #default="{row}">
                        {{ row.name }}({{ row.user }})
                    </template>
                </el-table-column>
                <el-table-column  label="like" prop="like" width="50">
                    <template #default="{row}">
                        <span v-show="row.status == 0">无</span>
                        <span v-show="row.status == 1">赞</span>
                        <span v-show="row.status == 2">踩</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" prop="date" width="200"/>
                <el-table-column align="right" width="180" fixed="right">
                    <template #default="{row}">
                        <el-button type="success" @click="onEditLike(1,row)" v-show="row.status == 2" plain>改赞</el-button>
                        <el-button type="danger" @click="onEditLike(2,row)" v-show="row.status == 1" plain>改踩</el-button>
                        <el-button type="info" @click="onEditLike(0,row)" plain>改无</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                @current-change="handleLikeItemCurrentChange"
                :current-page="pageLikeItem"
                :page-size="10"
                layout="total, prev, pager, next"
                background
                :total="totalLikeItem"/>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { addTopicLikeItem, findAllLikeItem, findAllTopicForSelect, findAllTopicLikeItem, updateTopicLikeItem } from '@/api/admin/topic';
import { findAllUsersForSelect } from '@/api/admin/user';
import { ElMessage, ElNotification } from 'element-plus';
import {inject,onMounted,reactive, ref} from 'vue'
const isDark = inject('isDark')
const topics = ref([])

const likeList = ref([])

const search = ref('')
const page = ref(1)
const total = ref(0)
const handleCurrentChange = (e)=>{
    page.value = e
    getTopicLikeList()
}
const editPage = ref(false)
const onEditTopicId = ref(0)
const onEdit = async(i)=>{
    onEditTopicId.value = i.id
    pageLikeItem.value = 1
    await getLikeItem()
    if(likeList.value.length > 0){
        editPage.value = true
    }
    else{
        ElMessage.error('无点赞信息')
    }
}
const onEditLike = async(i,item)=>{ 
    item.status = i
    await updateTopicLikeItem(item).then(async(res)=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            ElMessage.success('修改成功')
            getTopicLikeList()
            await getLikeItem()
            if(likeList.value.length == 0){
                editPage.value = false
                ElMessage.error('无点赞信息')
            }
        }
        else if(msg == 'NOT_EXIST_ERROR'){
            ElMessage.error('不存在点赞信息')
        }
        else{
            ElMessage.error('修改失败')
        }
    }).catch(err=>{
        ElMessage.error('服务错误')
    })
}
const like = reactive({
    topicId: '',
    user: '',
    status: ''
})
const rules = reactive({
    topicId: [{ required: true, message: '请选择主题', trigger: 'blur' }],
    user: [{ required: true, message: '请选择用户', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
})
const formInput = ref()
const addPage = ref(false)
const onAdd = ()=>{
    addPage.value = true
}
const confirm = ()=>{
    formInput.value.validate(async(valid)=>{
        await addTopicLikeItem(like).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success('添加成功')
                getTopicLikeList()
                clear()
            }
            else if(msg == 'LIKE_LOG_EXIST_ERROR'){
                ElMessage.error('已存在点赞信息')
            }
            else if(msg == 'LIKE_STATUS_UPDATE'){
                ElMessage.success('添加成功')
                getTopicLikeList()
                ElNotification({
                    title: '提示',
                    message: '存在信息,已改为'+(like.status == 1 ? '赞' : '踩'),
                    type: 'warning'
                })
                clear()
            }
            else{
                ElMessage.error('添加失败')
            }
        }).catch(err=>{
            ElMessage.error('服务错误')
        })
    })
}
const clear = ()=>{
    addPage.value = false
    like.topicId = ''
    like.user = ''
    like.status = ''
}
const pageLikeItem = ref(1)
const totalLikeItem = ref(0)
const handleLikeItemCurrentChange = (e)=>{
    pageLikeItem.value = e
    getLikeItem()
}
const getLikeItem = async()=>{
    await findAllLikeItem(onEditTopicId.value,pageLikeItem.value ).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            likeList.value = res.data.object
            totalLikeItem.value = res.data.num
        }
    }).catch(err=>{
        ElMessage.error('服务错误')
    })
}
const userSelect = ref([])
const getUserSelect = async () => {
  await findAllUsersForSelect()
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        userSelect.value = res.data.object
      }
    })
    .catch((err) => {
      ElMessage.error('服务错误')
    })
}
const topicSelect = ref([])
const getTopicSelect = async () => {
  await findAllTopicForSelect()
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        topicSelect.value = res.data.object
      }
    })
    .catch((err) => {
      ElMessage.error('服务错误')
    })
}
const getTopicLikeList = async()=>{
    await findAllTopicLikeItem(page.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            topics.value = res.data.object
            total.value = res.data.num
        }
    }).catch(err=>{
        ElMessage.error('服务错误')
    })
}
const init = ()=>{
    getTopicLikeList()
    getUserSelect()
    getTopicSelect()
}
onMounted(init)
</script>
<style scoped>
.like{
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
    --el-color-info-light-9: #424344;
    --el-color-info: #aaa;
    --el-button-hover-bg-color: #444;
}
</style>