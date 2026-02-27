<template>
    <div class="like" :class="isDark ? 'dark' : ''">
        <h2>喜爱管理</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="onAdd()" plain>添加</el-button>
        </div>
        <el-table :data="topics" :class="isDark ? 'dark' : ''">
            <el-table-column label="主题id" prop="id" width="250"/>
            <el-table-column label="标题" prop="title" width="600"/>
            <el-table-column label="分类" prop="label"/>
            <el-table-column label="用户" prop="user"/>
            <el-table-column label="点赞" prop="like"/>
            <el-table-column label="踩" prop="dislike"/>
            <el-table-column width="120" align="center" fixed="right">
                <template #header>
                    <el-input v-model="keyword" size="small" placeholder="Type to search" @input="search" title="可搜主题id、标题和发表用户"/>
                </template>
                <template #default="{row}">
                    <el-button type="primary" @click="onEdit(row)" plain>编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
            :class="isDark? 'dark':''"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="10"
            layout="total, prev, pager, next"
            background
            :total="total"/>
        </div>
        <el-dialog :class="isDark ? 'dark' : ''" v-model="addPage" :width="600" title="添加点赞信息" :close-on-click-modal="false" :show-close="false">
            <el-form ref="formInput" inline :rules="rules" :model="like">
                <el-form-item label="主题id" prop="topicId">
                    <el-select v-model="like.topicId" style="width: 500px;" 
                            filterable
                            remote
                            reserve-keyword
                            :remote-method="remoteMethodToTopic">
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
                    <el-select v-model="like.user" style="width: 200px;"
                            filterable
                            remote
                            reserve-keyword
                            :remote-method="remoteMethod">
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
        <el-dialog :class="isDark ? 'dark' : ''" v-model="editPage" width="800" title="修改点赞信息" align-center :close-on-click-modal="false">
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
                <el-table-column label="时间" prop="date" width="250"/>
                <el-table-column align="right" width="180" fixed="right">
                    <template #header>
                        <el-input :class="isDark? 'dark':''" v-model="likeKeyword" size="small" placeholder="Type to search" @input="searchLike" title="可搜用户和点赞状态（0和1）"/>
                    </template>
                    <template #default="{row}">
                        <el-button type="success" @click="onEditLike(1,row)" v-show="row.status == 2" plain>改赞</el-button>
                        <el-button type="danger" @click="onEditLike(2,row)" v-show="row.status == 1" plain>改踩</el-button>
                        <el-button type="info" @click="onEditLike(0,row)" plain>改无</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                :class="isDark? 'dark':''"
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

const search = ()=>{
    getTopicLikeList()
}
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
const likeKeyword = ref('')
const getLikeItem = async()=>{
    await findAllLikeItem(onEditTopicId.value,pageLikeItem.value,likeKeyword.value).then(res=>{
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
const remoteMethod = async(queryString)=>{
  if (!queryString) {
    userSelect.value = [];
    return;
  }
  await findAllUsersForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      userSelect.value = res.data.object || [];
    } else {
      ElMessage.error('获取用户列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
}
const topicSelect = ref([])
const remoteMethodToTopic = async (queryString) => {
  if (!queryString) {
    userSelect.value = [];
    return;
  }
  await findAllTopicForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      topicSelect.value = res.data.object || [];
    } else {
      ElMessage.error('获取用户列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
}
const keyword = ref('')
const getTopicLikeList = async()=>{
    await findAllTopicLikeItem(page.value,keyword.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            topics.value = res.data.object
            total.value = res.data.num
        }
    }).catch(err=>{
        ElMessage.error('服务错误')
    })
}
const searchLike = ()=>{
    getLikeItem()
}
const init = ()=>{
    getTopicLikeList()
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
</style>