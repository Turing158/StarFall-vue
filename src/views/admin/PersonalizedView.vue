<template>
    <div class="title"  :class="isDark ? 'dark' : ''">
        <h2>用户个性化管理</h2>
        <div style="margin: 10px 0;">
        </div>
        <el-table :data="personalizedList" :class="isDark ? 'dark' : ''">
            <el-table-column label="用户" width="200">
                <template #default="{ row }">
                    {{ row.name }}({{ row.user }})
                </template>
            </el-table-column>
            <el-table-column label="签名" prop="signature" width="600" />
            <el-table-column label="正版ID" prop="onlineName" width="250" />
            <el-table-column label="显示正版ID" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.showOnlineName === 1 ? 'success' : 'info'">
                        {{ row.showOnlineName === 1 ? '显示' : '隐藏' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="显示收藏" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.showCollection === 1 ? 'success' : 'info'">
                        {{ row.showCollection === 1 ? '显示' : '隐藏' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="显示生日" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.showBirthday === 1 ? 'success' : 'info'">
                        {{ row.showBirthday === 1 ? '显示' : '隐藏' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="显示性别" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.showGender === 1 ? 'success' : 'info'">
                        {{ row.showGender === 1 ? '显示' : '隐藏' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="显示邮箱" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.showEmail === 1 ? 'success' : 'info'">
                        {{ row.showEmail === 1 ? '显示' : '隐藏' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="180" />
            <el-table-column label="更新时间" prop="updateTime" width="180" />
            <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ row }">
                    <el-button type="primary" plain @click="openEditDialog(row)">编辑</el-button>
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
            title="编辑用户个性化设置"
            v-model="editDialog"
            width="980px"
            :close-on-click-modal="false"
        >
            <el-form :model="editForm" label-width="120px">
                <el-form-item label="用户ID">
                    <el-input v-model="editForm.user" disabled />
                </el-form-item>
                <el-form-item label="签名">
                    <ContentEditor 
                        ref="contentEdit" 
                        :value="editForm.signature" 
                        :maxHeight="200" 
                        :maxLength="500" 
                        style="width: 780px;"
                    />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="正版ID">
                            <el-input v-model="editForm.onlineName" placeholder="请输入正版ID" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示正版ID">
                            <el-radio-group v-model="editForm.showOnlineName">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">隐藏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="显示收藏">
                            <el-radio-group v-model="editForm.showCollection">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">隐藏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示生日">
                            <el-radio-group v-model="editForm.showBirthday">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">隐藏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="显示性别">
                            <el-radio-group v-model="editForm.showGender">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">隐藏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示邮箱">
                            <el-radio-group v-model="editForm.showEmail">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">隐藏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="editDialog = false">取消</el-button>
                <el-button type="primary" @click="handleEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {inject, onMounted, ref} from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { findAllPersonalized, updatePersonalized } from '@/api/admin/user'
import ContentEditor from '@/components/ContentEditor.vue'
const isDark = inject('isDark')
const total = ref(0)
const page = ref(1)
const personalizedList = ref([])
const editDialog = ref(false)
const contentEdit = ref(null)
const editForm = ref({
    user: '',
    name: '',
    signature: '',
    onlineName: '',
    showOnlineName: 1,
    showCollection: 1,
    showBirthday: 1,
    showGender: 1,
    showEmail: 1,
    createTime: '',
    updateTime: ''
})

const openEditDialog = (row) => {
    editForm.value = {
        user: row.user,
        name: row.name,
        signature: row.signature,
        onlineName: row.onlineName,
        showOnlineName: row.showOnlineName,
        showCollection: row.showCollection,
        showBirthday: row.showBirthday,
        showGender: row.showGender,
        showEmail: row.showEmail,
        createTime: row.createTime,
        updateTime: row.updateTime
    }
    editDialog.value = true
}

const handleEdit = async () => {
    if (!contentEdit.value) return
    const formData = {
        ...editForm.value,
        signature: contentEdit.value.content
    }
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await updatePersonalized(formData)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                ElMessage.success('编辑成功')
                editDialog.value = false
                getPersonalizedList()
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
}

const getPersonalizedList = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await findAllPersonalized(page.value)
        .then(res => {
            if (res.data.msg === 'SUCCESS') {
                personalizedList.value = res.data.object
                total.value = res.data.num
            } else {
                ElMessage.error('获取列表失败')
            }
        })
        .catch(err => {
            ElMessage.error('获取列表失败')
        })
        .finally(() => {
            loading.close()
        })
}

const handleCurrentChange = (e)=>{
    page.value = e
    getPersonalizedList()
}

const init = ()=>{
    getPersonalizedList()
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
</style>
