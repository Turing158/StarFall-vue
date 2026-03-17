<template>
    <div class="title"  :class="isDark ? 'dark' : ''">
        <h2>用户勋章管理</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" plain @click="openAddDialog">添加</el-button>
        </div>
        <el-table :data="medalMappers" :class="isDark ? 'dark' : ''">
            <el-table-column label="用户" width="200">
                <template #default="{ row }">
                    {{ row.userName }}({{ row.user }})
                </template>
            </el-table-column>
            <el-table-column label="勋章名称" prop="name" width="250">
            </el-table-column>
            <el-table-column label="勋章图标" prop="icon" width="250" align="center">
                <template #default="{ row }">
                    <img class="medal-icon" :src="`/src/assets/img${row.icon}`" />
                </template>
            </el-table-column>
            <el-table-column label="来源" prop="source" width="280" />
            <el-table-column label="获得时间" prop="gainTime" width="280" />
            <el-table-column label="过期时间" prop="expireTime" width="280" />
            <el-table-column label="操作" width="180" align="center" fixed="right">
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
            :title="dialogTitle"
            v-model="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form :model="form" label-width="80px">
                <el-form-item label="用户" required>
                    <el-select 
                        style="width: 100%" 
                        v-model="form.user" 
                        placeholder="请选择用户"
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="remoteMethodToUser"
                        :disabled="isEdit">
                        <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user">
                            <span style="float: left">{{ item.user }}</span>
                            <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.name }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="勋章" required>
                    <el-select 
                        v-model="form.id" 
                        placeholder="请选择勋章" 
                        style="width: 100%"
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="remoteMethodToMedal"
                        @visible-change="onMedalSelectVisible"
                    >
                        <el-option
                            v-for="item in medalOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                            <div style="display: flex; align-items: center;">
                                <img :src="`/src/assets/img${item.icon}`" style="width: 30px; height: 30px; margin-right: 10px;" />
                                <span>{{ item.name }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="获得时间" required>
                    <el-date-picker
                        v-model="form.gainTime"
                        type="datetime"
                        placeholder="请选择获得时间"
                        style="width: 100%"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="过期时间">
                    <el-date-picker
                        v-model="form.expireTime"
                        type="datetime"
                        placeholder="请选择过期时间"
                        style="width: 100%"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">{{ isEdit ? '保存' : '添加' }}</el-button>
            </template>
        </el-dialog>
        
        <el-dialog
            :class="isDark ? 'dark' : ''"
            title="删除用户勋章"
            v-model="deleteDialog"
            width="400px"
            :close-on-click-modal="false"
        >
            <div>确定删除该用户勋章吗？</div>
            <template #footer>
                <el-button @click="deleteDialog = false">取消</el-button>
                <el-button type="danger" @click="handleDelete">删除</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {inject, onMounted, ref} from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { findAllMedalMapper, findAllMedal, insertMedalMapper, updateMedalMapper, deleteMedalMapper, findAllUsersForSelect } from '@/api/admin/user'
const isDark = inject('isDark')
const medalMappers = ref([])
const total = ref(0)
const page = ref(1)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const form = ref({
    id: '',
    user: '',
    gainTime: '',
    expireTime: ''
})

const medalOptions = ref([])
const medalPage = ref(1)
const medalTotal = ref(0)
const medalLoading = ref(false)

const userSelect = ref([])

const deleteDialog = ref(false)
const deleteRow = ref(null)

const getMedalMappers = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await findAllMedalMapper(page.value)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                medalMappers.value = res.data.object
                total.value = res.data.num
            } else {
                ElMessage.error('获取用户勋章列表失败')
            }
        })
        .catch(err => {
            ElMessage.error('获取用户勋章列表失败')
        })
        .finally(() => {
            loading.close()
        })
}

const handleCurrentChange = (e)=>{
    page.value = e
    getMedalMappers()
}

const openAddDialog = () => {
    isEdit.value = false
    dialogTitle.value = '添加用户勋章'
    form.value = {
        id: '',
        user: '',
        gainTime: '',
        expireTime: ''
    }
    dialogVisible.value = true
}

const openEditDialog = (row) => {
    isEdit.value = true
    dialogTitle.value = '编辑用户勋章'
    form.value = {
        id: row.id || '',
        user: row.user,
        gainTime: row.gainTime || '',
        expireTime: row.expireTime || ''
    }
    dialogVisible.value = true
}

const remoteMethodToMedal = async (queryString) => {
    if (!queryString) {
        medalOptions.value = []
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: '搜索中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await loadMedalOptions(queryString)
        .finally(() => {
            loading.close()
        })
}

const onMedalSelectVisible = (visible) => {
    if (visible && medalOptions.value.length === 0) {
        loadMedalOptions('')
    }
}

const loadMedalOptions = async (queryString) => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    medalLoading.value = true
    medalPage.value = 1
    await findAllMedal(medalPage.value)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                let options = res.data.object || []
                if (queryString) {
                    options = options.filter(item => 
                        item.name.toLowerCase().includes(queryString.toLowerCase())
                    )
                }
                medalOptions.value = options
                medalTotal.value = res.data.num
            }
        })
        .catch(err => {
            ElMessage.error('获取勋章列表失败')
        })
        .finally(() => {
            medalLoading.value = false
            loading.close()
        })
}

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

const handleSubmit = async () => {
    if (!form.value.user || !form.value.id) {
        ElMessage.warning('请填写必填项')
        return
    }
    
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    
    if (isEdit.value) {
        await updateMedalMapper(form.value)
            .then(res => {
                if (res.data.msg === 'SUCCESS') {
                    ElMessage.success('编辑成功')
                    dialogVisible.value = false
                    getMedalMappers()
                } else {
                    ElMessage.error('编辑失败')
                }
            })
            .catch(err => {
                ElMessage.error('编辑失败')
            })
            .finally(() => {
                loading.close()
            })
    } else {
        await insertMedalMapper(form.value)
            .then(res => {
                if (res.data.msg === 'SUCCESS') {
                    ElMessage.success('添加成功')
                    dialogVisible.value = false
                    getMedalMappers()
                } else {
                    ElMessage.error('添加失败')
                }
            })
            .catch(err => {
                ElMessage.error('添加失败')
            })
            .finally(() => {
                loading.close()
            })
    }
}

const openDeleteDialog = (row) => {
    deleteRow.value = row
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!deleteRow.value) return
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteMedalMapper(deleteRow.value.user, deleteRow.value.id)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                ElMessage.success('删除成功')
                deleteDialog.value = false
                getMedalMappers()
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

const init = ()=>{
    getMedalMappers()
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
.medal-icon{
    width: 80px;
    height: 80px;
    image-rendering: auto;
    border-radius: 5px;
    border: 1px solid #ccc;
}
</style>