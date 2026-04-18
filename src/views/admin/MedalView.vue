<template>
    <div class="title"  :class="isDark ? 'dark' : ''">
        <h2>勋章列表</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="onAdd()" plain>添加</el-button>
        </div>
        <el-table :data="medals" :class="isDark ? 'dark' : ''">
            <el-table-column label="id" prop="id" width="220"/>
            <el-table-column label="图标" prop="icon" width="200">
                <template #default="{row}">
                    <el-image v-if="row.icon" :src="`/img${row.icon}`" style="width: 80px; height: 80px" fit="contain"/>
                </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" width="150"/>
            <el-table-column label="描述" prop="description"/>
            <el-table-column label="来源" prop="source" width="150"/>
            <el-table-column label="创建时间" prop="createTime" width="180"/>
            <el-table-column width="200" align="center">
                <template #default="{row}">
                    <el-button type="primary" @click="onEdit(row)" plain>编辑</el-button>
                    <el-button type="danger" @click="onDel(row)" plain>删除</el-button>
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
        <el-dialog :class="isDark ? 'dark' : ''" v-model="dialogVisible" :title="isEdit ? '编辑勋章' : '添加勋章'">
            <el-form>
                <el-form-item label="ID">
                    <el-input v-model="medalId" disabled :placeholder="isEdit ? '' : '自动生成'"/>
                </el-form-item>
                <el-form-item label="图标">
                    <div style="width: 100%;display: flex; align-items: center; gap: 8px;">
                        <el-select 
                            v-model="medalIcon" 
                            placeholder="选择勋章图标"
                            filterable
                            remote
                            reserve-keyword
                            :remote-method="searchMedalImages"
                            :loading="imageLoading"
                            style="flex: 1; min-width: 300px;">
                            <el-option v-for="item in medalImages" :key="item.value" :label="item.label" :value="item.value">
                                <span style="float: left">{{ item.label }}</span>
                                <el-image :src="`/img${item.value}`" style="width: 30px; height: 30px; float: right; margin-top: 5px" fit="contain"/>
                            </el-option>
                        </el-select>
                        <el-button @click="refreshMedalImages" size="small" type="primary" plain>
                            <el-icon><Refresh /></el-icon>
                        </el-button>
                        <el-button @click="triggerUploadMedalImg" size="small" type="success" plain>
                            <el-icon><Plus /></el-icon>
                        </el-button>
                        <input ref="uploadInputRef" type="file" accept="image/png" style="display: none" @change="handleUploadMedalImg"/>
                    </div>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="medalName"/>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="medalDescription" type="textarea" :rows="3"/>
                </el-form-item>
                <el-form-item label="来源">
                    <el-input v-model="medalSource"/>
                </el-form-item>
                <el-form-item label="创建时间" required>
                    <el-date-picker
                        v-model="medalCreateTime"
                        type="datetime"
                        placeholder="请选择创建时间"
                        style="width: 100%"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :disabled="isEdit"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="clear()" type="danger" plain>取 消</el-button>
                <el-button type="primary" @click="confirmAction()" plain>确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { findAllMedal, insertMedal, updateMedal, deleteMedal } from '@/api/admin/user';
import { uploadMedalImg, getMedalImg } from '@/api/admin/other';
import { ElMessage, ElMessageBox, ElLoading, ElIcon } from 'element-plus';
import { Refresh, Plus } from '@element-plus/icons-vue';
import {inject, onMounted, ref} from 'vue'
const isDark = inject('isDark')
const medals = ref([])
const total = ref(0)
const page = ref(1)
const handleCurrentChange = (e)=>{
    page.value = e
    getMedalList()
}
const medalId = ref('')
const medalIcon = ref('')
const medalName = ref('')
const medalDescription = ref('')
const medalSource = ref('')
const medalCreateTime = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const medalImages = ref([])
const imageLoading = ref(false)
const medalFileNames = ref([])

const loadMedalFileNames = async ()=>{
    try{
        const res = await getMedalImg()
        if(res.data.msg == 'SUCCESS'){
            console.log(res.data.object)
            medalFileNames.value = res.data.object || []
        }
    }catch(err){
        medalFileNames.value = []
    }
}

const searchMedalImages = (query)=>{
    if(query){
        imageLoading.value = true
        setTimeout(()=>{
            medalImages.value = medalFileNames.value
                .filter(file => file.toLowerCase().includes(query.toLowerCase()))
                .map(file => ({
                    label: file,
                    value: `/medal/${file}`
                }))
            imageLoading.value = false
        }, 300)
    }else{
        medalImages.value = medalFileNames.value.map(file => ({
            label: file,
            value: `/medal/${file}`
        }))
    }
}

const onAdd = ()=>{
    isEdit.value = false
    medalId.value = ''
    medalIcon.value = ''
    medalName.value = ''
    medalDescription.value = ''
    medalSource.value = ''
    medalCreateTime.value = new Date().toISOString().replace('T', ' ').split('.')[0]
    refreshMedalImages()
    dialogVisible.value = true
}

const onEdit = (i)=>{
    isEdit.value = true
    medalId.value = i.id
    medalIcon.value = i.icon
    medalName.value = i.name
    medalDescription.value = i.description
    medalSource.value = i.source
    medalCreateTime.value = i.createTime
    refreshMedalImages()
    dialogVisible.value = true
}

const confirmAction = async()=>{
    if(!medalName.value){
        ElMessage.error("名称不能为空！")
        return
    }
    if(!medalCreateTime.value){
        ElMessage.error("创建时间不能为空！")
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    let obj = {
        id: medalId.value,
        icon: medalIcon.value,
        name: medalName.value,
        description: medalDescription.value,
        source: medalSource.value,
        createTime: medalCreateTime.value
    }
    let success = false
    try{
        if(isEdit.value){
            const res = await updateMedal(obj)
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("修改成功！")
                success = true
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error("勋章不存在！")
            }
            else{
                ElMessage.error("修改失败！")
            }
        }else{
            const res = await insertMedal(obj)
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("添加成功！")
                success = true
            }
            else{
                ElMessage.error("添加失败！")
            }
        }
    }catch(err){
        ElMessage.error("服务异常")
    }finally{
        loading.close()
    }
    if(success){
        clear()
        await getMedalList()
    }
}

const clear = ()=>{
    dialogVisible.value = false
    medalId.value = ''
    medalIcon.value = ''
    medalName.value = ''
    medalDescription.value = ''
    medalSource.value = ''
    medalCreateTime.value = ''
}

const refreshMedalImages = async ()=>{
    await loadMedalFileNames()
    medalImages.value = medalFileNames.value.map(file => ({
        label: file,
        value: `/medal/${file}`
    }))
}
refreshMedalImages()
const uploadInputRef = ref(null)
const triggerUploadMedalImg = ()=>{
    uploadInputRef.value.click()
}
const handleUploadMedalImg = async(e)=>{
    const file = e.target.files[0]
    if(!file) return
    if(!file.name.endsWith('.png')){
        ElMessage.error('仅支持PNG格式图片')
        uploadInputRef.value.value = ''
        return
    }
    const defaultName = file.name.replace(/\.png$/i, '')
    ElMessageBox.prompt('请输入图片名称（不含扩展名）', '上传勋章图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: defaultName,
        inputPattern: /^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/,
        inputErrorMessage: '名称只能包含字母、数字、下划线、横线和中文'
    }).then(async({ value })=>{
        const imgName = value + '.png'
        const reader = new FileReader()
        reader.onload = async(ev)=>{
            const base64 = ev.target.result
            const loading = ElLoading.service({
                lock: true,
                text: '上传中...',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            try{
                const res = await uploadMedalImg(imgName, base64)
                if(res.data.msg == 'SUCCESS'){
                    ElMessage.success('上传成功')
                    if(!medalFileNames.value.includes(imgName)){
                        medalFileNames.value.push(imgName)
                    }
                    medalImages.value = medalFileNames.value.map(f => ({
                        label: f,
                        value: `/medal/${f}`
                    }))
                    medalIcon.value = `/medal/${imgName}`
                }else{
                    ElMessage.error('上传失败')
                }
            }catch(err){
                ElMessage.error('服务异常')
            }finally{
                loading.close()
            }
        }
        reader.readAsDataURL(file)
    }).catch(()=>{
    })
    uploadInputRef.value.value = ''
}
const onDel = (i)=>{
    ElMessageBox.confirm(i.name, '确定删除该勋章吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const loading = ElLoading.service({
            lock: true,
            text: '处理中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        let success = false
        try{
            const res = await deleteMedal(i.id)
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("删除成功！")
                success = true
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error("勋章不存在！")
            }
            else{
                ElMessage.error("删除失败！")
            }
        }catch(err){
            ElMessage.error("服务异常")
        }finally{
            loading.close()
        }
        if(success){
            await getMedalList()
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      });
}

const getMedalList = async()=>{
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await findAllMedal(page.value).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            medals.value = res.data.object
            total.value = res.data.num
        }
    }).catch(err=>{
        ElMessage.error("获取勋章列表失败！")
    })
    .finally(() => {
        loading.close()
    })
}

const init = ()=>{
    getMedalList()
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
