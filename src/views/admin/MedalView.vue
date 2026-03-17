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
                    <el-image v-if="row.icon" :src="`/src/assets/img${row.icon}`" style="width: 80px; height: 80px" fit="contain"/>
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
                                <el-image :src="`/src/assets/img${item.value}`" style="width: 30px; height: 30px; float: right; margin-top: 5px" fit="contain"/>
                            </el-option>
                        </el-select>
                        <el-button @click="refreshMedalImages" size="small" type="primary" plain>
                            <el-icon><Refresh /></el-icon>
                        </el-button>
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
                <el-form-item label="创建时间">
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
import { ElMessage, ElMessageBox, ElLoading, ElIcon } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
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

const medalImageFiles = [
  '2025year.png',
  '2026year.png',
  'admin.png',
  'already3year.png',
  'continual30day.png',
  'continual365day.png',
  'liveManager.png',
  'mapCreator.png',
  'modCreator.png',
  'newPlayer.png',
  'onlinePlayer.png',
  'packCreator.png',
  'skinCreator.png',
  'talkMaster.png',
  'textureCreator.png',
  'translator.png',
  'villageHero.png'
]

const searchMedalImages = (query)=>{
    if(query){
        imageLoading.value = true
        setTimeout(()=>{
            medalImages.value = medalImageFiles
                .filter(file => file.toLowerCase().includes(query.toLowerCase()))
                .map(file => ({
                    label: file,
                    value: `/medal/${file}`
                }))
            imageLoading.value = false
        }, 300)
    }else{
        medalImages.value = medalImageFiles.map(file => ({
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
    medalCreateTime.value = ''
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
    if(isEdit.value){
        await updateMedal(obj).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("修改成功！")
                clear()
                getMedalList()
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error("勋章不存在！")
            }
            else{
                ElMessage.error("修改失败！")
            }
        }).catch(err=>{
            ElMessage.error("服务异常")
        })
        .finally(() => {
            loading.close()
        })
    }else{
        await insertMedal(obj).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("添加成功！")
                clear()
                getMedalList()
            }
            else{
                ElMessage.error("添加失败！")
            }
        }).catch(err=>{
            ElMessage.error("服务异常")
        })
        .finally(() => {
            loading.close()
        })
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

const refreshMedalImages = ()=>{
    const asyncModules = import.meta.glob('/src/assets/img/medal/*.png')
    medalImages.value = []
    for (const path in asyncModules) {
        asyncModules[path]().then((module) => {
            medalImages.value.push({
                label: path.split('/').pop(),
                value: module.default
            })
        })
    }
}
refreshMedalImages()
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
        await deleteMedal(i.id).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("删除成功！")
                getMedalList()
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error("勋章不存在！")
            }
            else{
                ElMessage.error("删除失败！")
            }
        }).catch(err=>{
            ElMessage.error("服务异常")
        
        })
        .finally(() => {
            loading.close()
        })
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
