<template>
    <div class="title"  :class="isDark ? 'dark' : ''">
        <h2>好友管理</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" plain @click="openAddDialog">添加</el-button>
        </div>
        <el-table :data="friendRelations" :class="isDark ? 'dark' : ''">
            <el-table-column label="ID" prop="id" width="220" />
            <el-table-column label="发起人" width="250">
                <template #default="{ row }">
                    {{ row.fromUserName }}({{ row.fromUser }})
                </template>
            </el-table-column>
            <el-table-column label="接收人" width="250">
                <template #default="{ row }">
                    {{ row.toUserName }}({{ row.toUser }})
                </template>
            </el-table-column>
            <el-table-column label="关系" prop="relation" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.relation === 0 ? 'warning' : row.relation === -1 ? 'danger' : 'success'">
                        {{ row.relation === 0 ? '免打扰' : row.relation === -1 ? '拉黑' : '正常' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="alias" width="250" />
            <el-table-column label="创建时间" prop="createTime" width="180" />
            <el-table-column label="更新时间" prop="updateTime" width="180" />
            <el-table-column label="顶置" prop="isTop" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.isTop === 1 ? 'success' : 'info'">
                        {{ row.isTop === 1 ? '顶置' : '否' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
                <template #default="{ row }">
                    <el-button type="primary" plain @click="openEditDialog(row)">编辑</el-button>
                    <el-button type="danger" plain @click="openDeleteDialog(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
            :class="isDark ? 'dark' : ''"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="10"
            layout="total, prev, pager, next"
            background
            :total="total"/>
        </div>
        
        <el-dialog
            :class="isDark ? 'dark' : ''"
            title="添加好友关系"
            v-model="addDialog"
            width="800px"
            :close-on-click-modal="false"
        >
            <div class="dialog-content">
                <div class="dialog-left">
                    <h4>用户A</h4>
                    <el-form :model="friendFormA" label-width="80px">
                        <el-form-item label="发起人" required>
                            <el-select 
                                style="width: 100%" 
                                v-model="friendFormA.fromUser" 
                                placeholder="请选择发起人"
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="remoteMethodToUser">
                                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                                    <span style="float: left">{{ item.user }}</span>
                                    <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接收人" required>
                            <el-select 
                                style="width: 100%" 
                                v-model="friendFormA.toUser" 
                                placeholder="请选择接收人"
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="remoteMethodToUser">
                                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                                    <span style="float: left">{{ item.user }}</span>
                                    <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关系">
                            <el-select v-model="friendFormA.relation" placeholder="请选择关系">
                                <el-option label="正常" :value="1" />
                                <el-option label="免打扰" :value="0" />
                                <el-option label="拉黑" :value="-1" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="friendFormA.alias" placeholder="请输入备注" />
                        </el-form-item>
                        <el-form-item label="创建时间" required>
                            <el-date-picker
                                v-model="friendFormA.createTime"
                                type="datetime"
                                placeholder="请选择创建时间"
                                style="width: 100%"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                            />
                        </el-form-item>
                        <el-form-item label="是否置顶">
                            <el-select v-model="friendFormA.isTop" placeholder="请选择">
                                <el-option label="是" :value="1" />
                                <el-option label="否" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-right">
                    <h4>用户B</h4>
                    <el-form :model="friendFormB" label-width="80px">
                        <el-form-item label="发起人" required>
                            <el-select 
                                style="width: 100%" 
                                v-model="friendFormB.fromUser" 
                                placeholder="请选择发起人"
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="remoteMethodToUser">
                                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                                    <span style="float: left">{{ item.user }}</span>
                                    <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接收人" required>
                            <el-select 
                                style="width: 100%" 
                                v-model="friendFormB.toUser" 
                                placeholder="请选择接收人"
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="remoteMethodToUser">
                                <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                                    <span style="float: left">{{ item.user }}</span>
                                    <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关系">
                            <el-select v-model="friendFormB.relation" placeholder="请选择关系">
                                <el-option label="正常" :value="1" />
                                <el-option label="免打扰" :value="0" />
                                <el-option label="拉黑" :value="-1" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="friendFormB.alias" placeholder="请输入备注" />
                        </el-form-item>
                        <el-form-item label="创建时间" required>
                            <el-date-picker
                                v-model="friendFormB.createTime"
                                type="datetime"
                                placeholder="请选择创建时间"
                                style="width: 100%"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                            />
                        </el-form-item>
                        <el-form-item label="是否置顶">
                            <el-select v-model="friendFormB.isTop" placeholder="请选择">
                                <el-option label="是" :value="1" />
                                <el-option label="否" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <template #footer>
                <el-button @click="addDialog = false">取消</el-button>
                <el-button type="primary" @click="handleAddFriend">添加</el-button>
            </template>
        </el-dialog>
        
        <el-dialog
            :class="isDark ? 'dark' : ''"
            title="编辑好友关系"
            v-model="editDialog"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form :model="editForm" label-width="80px">
                <el-form-item label="ID">
                    <el-input v-model="editForm.id" disabled />
                </el-form-item>
                <el-form-item label="发起人">
                    <el-input v-model="editForm.fromUser" disabled />
                </el-form-item>
                <el-form-item label="接收人">
                    <el-input v-model="editForm.toUser" disabled />
                </el-form-item>
                <el-form-item label="关系">
                    <el-select v-model="editForm.relation" placeholder="请选择关系">
                        <el-option label="正常" :value="1" />
                        <el-option label="免打扰" :value="0" />
                        <el-option label="拉黑" :value="-1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.alias" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-select v-model="editForm.isTop" placeholder="请选择">
                        <el-option label="顶置" :value="1" />
                        <el-option label="不顶置" :value="0" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialog = false">取消</el-button>
                <el-button type="primary" @click="handleEditFriend">保存</el-button>
            </template>
        </el-dialog>
        
        <el-dialog
            :class="isDark ? 'dark' : ''"
            title="删除好友关系"
            v-model="deleteDialog"
            width="400px"
            :close-on-click-modal="false"
        >
            <div style="margin-bottom: 20px;">确定删除该好友关系吗？</div>
            <el-checkbox v-model="syncDelete">同步删除另一个关系</el-checkbox>
            <template #footer>
                <el-button @click="deleteDialog = false">取消</el-button>
                <el-button type="danger" @click="handleDeleteFriend">删除</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {inject, onMounted, ref, watch} from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { findAllFriendRelation, insertFriendRelation, updateFriendRelation, deleteFriendRelation } from '@/api/admin/interaction'
import { findAllUsersForSelect } from '@/api/admin/user'
const isDark = inject('isDark')
const friendRelations = ref([])
const total = ref(0)
const page = ref(1)
const userSelect = ref([])

const addDialog = ref(false)
const friendFormA = ref({
    fromUser: '',
    toUser: '',
    relation: 0,
    alias: '',
    createTime: '',
    isTop: 0
})
const friendFormB = ref({
    fromUser: '',
    toUser: '',
    relation: 0,
    alias: '',
    createTime: '',
    isTop: 0
})

const editDialog = ref(false)
const editForm = ref({
    id: '',
    fromUser: '',
    toUser: '',
    relation: 0,
    alias: '',
    isTop: 0
})

const deleteDialog = ref(false)
const deleteRow = ref(null)
const syncDelete = ref(true)

const remoteMethodToUser = async (queryString) => {
    if (!queryString) {
        userSelect.value = []
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: '搜索中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await findAllUsersForSelect(queryString).then(res => {
        if (res.data.msg === 'SUCCESS') {
            userSelect.value = res.data.object
        } else {
            ElMessage.error('获取用户列表失败！')
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('服务异常')
    })
    .finally(() => {
        loading.close()
    })
}

watch(() => friendFormA.value.fromUser, (val) => {
    friendFormB.value.toUser = val
})
watch(() => friendFormA.value.toUser, (val) => {
    friendFormB.value.fromUser = val
})
watch(() => friendFormB.value.fromUser, (val) => {
    friendFormA.value.toUser = val
})
watch(() => friendFormB.value.toUser, (val) => {
    friendFormA.value.fromUser = val
})

watch(() => friendFormA.value.createTime, (val) => {
    friendFormB.value.createTime = val
})
watch(() => friendFormB.value.createTime, (val) => {
    friendFormA.value.createTime = val
})

const openAddDialog = () => {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0]
    friendFormA.value = {
        fromUser: '',
        toUser: '',
        relation: 1,
        alias: '',
        createTime: now,
        isTop: 0
    }
    friendFormB.value = {
        fromUser: '',
        toUser: '',
        relation: 1,
        alias: '',
        createTime: now,
        isTop: 0
    }
    addDialog.value = true
}

const openEditDialog = (row) => {
    editForm.value = {
        id: row.id,
        fromUser: row.fromUser,
        toUser: row.toUser,
        relation: row.relation,
        alias: row.alias,
        isTop: row.isTop
    }
    editDialog.value = true
}

const handleAddFriend = async () => {
    if (!friendFormA.value.fromUser || !friendFormA.value.toUser || !friendFormB.value.fromUser || !friendFormB.value.toUser) {
        ElMessage.warning('请输入所有用户ID')
        return
    }
    if (friendFormA.value.fromUser === friendFormA.value.toUser) {
        ElMessage.warning('用户A的发起人和接收人不能是同一个人')
        return
    }
    if (friendFormB.value.fromUser === friendFormB.value.toUser) {
        ElMessage.warning('用户B的发起人和接收人不能是同一个人')
        return
    }
    const formA = {
        fromUser: friendFormA.value.fromUser,
        toUser: friendFormA.value.toUser,
        relation: friendFormA.value.relation,
        alias: friendFormA.value.alias,
        createTime: friendFormA.value.createTime,
        isTop: friendFormA.value.isTop
    }
    const formB = {
        fromUser: friendFormB.value.fromUser,
        toUser: friendFormB.value.toUser,
        relation: friendFormB.value.relation,
        alias: friendFormB.value.alias,
        createTime: friendFormB.value.createTime,
        isTop: friendFormB.value.isTop
    }
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await insertFriendRelation([formA, formB])
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                ElMessage.success('添加好友关系成功')
                addDialog.value = false
                getFriendRelations()
            }
            else if(res.data.msg === 'EXIST_RELATION'){
                ElMessage.warning('好友关系已存在')
            } else {
                ElMessage.error('添加好友关系失败')
            }
        })
        .catch(err => {
            ElMessage.error('添加好友关系失败')
        })
        .finally(() => {
            loading.close()
        })
}

const handleEditFriend = async () => {
    console.log(editForm.value)
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await updateFriendRelation(editForm.value)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                ElMessage.success('编辑好友关系成功')
                editDialog.value = false
                getFriendRelations()
            } else {
                ElMessage.error('编辑好友关系失败')
            }
        })
        .catch(err => {
            ElMessage.error('编辑好友关系失败')
        })
        .finally(() => {
            loading.close()
        })
}

const openDeleteDialog = (row) => {
    deleteRow.value = row
    syncDelete.value = true
    deleteDialog.value = true
}

const handleDeleteFriend = async () => {
    if (!deleteRow.value) return
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteFriendRelation(deleteRow.value.id, syncDelete.value)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                ElMessage.success('删除成功')
                deleteDialog.value = false
                getFriendRelations()
            } else {
                ElMessage.error('删除失败')
            }
        })
        .catch(err => {
            ElMessage.error('删除失败')
        })
        .finally(() => {
            loading.close()
        })
}

const getFriendRelations = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await findAllFriendRelation(page.value)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                friendRelations.value = res.data.object
                total.value = res.data.num
            } else {
                ElMessage.error('获取好友关系列表失败')
            }
        })
        .catch(err => {
            ElMessage.error('获取好友关系列表失败')
        })
        .finally(() => {
            loading.close()
        })
}

const handleCurrentChange = (e)=>{
    page.value = e
    getFriendRelations()
}

const init = ()=>{
    getFriendRelations()
}
onMounted(init)
</script>
<style scoped>
.title{
    width: calc(100% - 40px);
    margin: 20px;
}
.page{
    margin-top: 20px;
    display: flex;
    justify-content: end;
}
.dialog-content {
    display: flex;
    gap: 20px;
}
.dialog-left, .dialog-right {
    flex: 1;
    padding: 0 10px;
}
.dialog-left {
    border-right: 1px solid #dcdfe6;
}
.dialog-left h4, .dialog-right h4 {
    margin-bottom: 15px;
    text-align: center;
}
</style>
