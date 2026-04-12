<template>
    <div class="main">
        <span class="listTitle">每<br/>日<br/>一<br/>言</span>
        <div class="daySay">
            <div class="table-container" ref="tableContainer">
                <table>
                    <tr class="item" v-for="(item,index) in data" :key="index">
                        <td>
                            <div class="user">
                                <img class="avatar" :src="getAvatarSrc(item.avatar)" alt="">
                                <span class="username" @click="handleClickUser(item.user)">{{ item.name }}</span>
                                <div class="date-wrapper">
                                    <button 
                                        v-if="canDelete(item.user)" 
                                        class="delete-btn"
                                        @click="handleDelete(index, item.id)"
                                        :disabled="deleteLoading === index">
                                        ×
                                    </button>
                                    <span class="date">{{ formatDate(item.date) }}</span>
                                </div>
                            </div>
                            <span class="content">{{ item.content }}</span>
                            <div class="divide"></div>
                        </td>
                    </tr>
                    <tr class="loading" v-if="isLoading">
                        <td>
                            <div>
                                <span class="loadingText">加载中...</span>
                            </div>
                        </td>
                    </tr>
                    <tr class="no-more" v-if="!isLoading && !hasMoreData && data.length > 0">
                        <td>
                            <div>
                                <span class="noMoreText" @click="handleRefreshNoMore">
                                  没有更多数据了（点击刷新）
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="daySayBottom">
                <div v-if="userStore.isLogin" class="talkContainer">
                    <el-input 
                    v-model="newTalkContent" 
                    class="talkInput" 
                    placeholder="输入每日一言..."/>
                    <McBtn class="publishBtn" @click="handlePublish">发布</McBtn>
                </div>
                <div v-else class="loginPrompt">请登录</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { findAllHomeTalk,publicHomeTalk,deleteHomeTalk } from '@/api/home'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import McBtn from '@/components/McBtn.vue'
import { getAvatarSrc } from '@/api/user';
import { ElLoading } from 'element-plus'
const userStore = useUserStore()
const tableContainer = ref(null)
const isLoading = ref(false)
const hasMoreData = ref(true)
const deleteLoading = ref(-1)
const router = useRouter()
const data = ref([])
const newTalkContent = ref('')
const handlePublish = async () => {
    if (!newTalkContent.value.trim()) {
        ElMessage({
            message: '请输入内容',
            type: 'warning'
          })
        return;
    }
    if (newTalkContent.value.trim().length < 5) {
        ElMessage({
            message: '内容不能少于5个字符',
            type: 'warning'
          })
        return;
    }
    if (newTalkContent.value.trim().length > 80) {
        ElMessage({
            message: '内容不能超过80个字符',
            type: 'warning'
          })
        return;
    }
    let loading = ElLoading.service({
        lock: true,
        text: '发布中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await publicHomeTalk(newTalkContent.value)
    .then(res=>{
        let msg = res.data.msg
        if(msg == "SUCCESS"){
            newTalkContent.value = '';
            data.value = [];
            refreshData();
            ElMessage({
                message: '发布成功',
                type: 'success'
            })
        }
        else if(msg == "REPEATED"){
            ElMessage({
                message: '你今天发话过了',
                type: 'warning'
            })
        }
        else if(msg == "SENSITIVE_ERROR"){
            ElMessage({
                message: '包含敏感内容',
                type: 'warning'
            })
        } else {
            ElMessage({
                message: '发布失败',
                type: 'error'
            })
        }
    }).catch(e=>{
        ElMessage({
            message: '发布失败',
            type: 'error'
        })
    })
    loading.close()
}

const refreshData = async()=>{
    if (isLoading.value) return
    isLoading.value = true
    await findAllHomeTalk(data.value.length)
    .then(res=>{
        let obj = res.data.object
        if(obj && obj.length > 0){
            if (data.value.length === 0) {
                data.value = obj
            } else {
                data.value.push(...obj)
            }
        } else {
            hasMoreData.value = false
        }
    }).catch(e=>{
        console.error('加载数据失败')
    })
    isLoading.value = false
}
const handleScroll = () => {
    if (!tableContainer.value || isLoading.value || !hasMoreData.value) return
    
    const { scrollTop, clientHeight, scrollHeight } = tableContainer.value
    if (scrollTop + clientHeight >= scrollHeight - 1) {
        refreshData()
    }
}

const handleRefreshNoMore = () => {
    hasMoreData.value = true
    refreshData()
}

const handleClickUser = (user)=>{
    router.push("/personal/other/"+user)
}

const canDelete = (user) => {
    return userStore.isLogin && userStore.user === user
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return dateStr.split(' ')[0]
}

const handleDelete = async (index, id) => {
    deleteLoading.value = index
    await deleteHomeTalk(id)
        .then(res => {
            let msg = res.data.msg
            if (msg === 'SUCCESS') {
                data.value.splice(index, 1)
                ElMessage({
                    message: '删除成功',
                    type: 'success'
                })
            } else {
                ElMessage({
                    message: '删除失败',
                    type: 'error'
                })
            }
        })
        .catch(e => {
            ElMessage({
                message: '删除失败',
                type: 'error'
            })
        })
    deleteLoading.value = -1
}

onMounted(() => {
    refreshData()
    
    if (tableContainer.value) {
        tableContainer.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(()=>{
    if (tableContainer.value) {
        tableContainer.value.removeEventListener('scroll', handleScroll)
    }
})

</script>
<style scoped>
.main{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
}
.daySay{
    width: 90%;
    padding: 10px;
}
.daySay table{
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.daySayBottom {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
}

.talkInput {
    flex: 1;
    min-height: 30px;
    border-radius: 4px;
    resize: none;
    box-sizing: border-box;
}

.publishBtn {
    padding: 8px 16px;
    height: 40px;
    align-self: flex-start;
}
.publishBtn:hover {
  background-color: #4096ff;
}
.talkContainer {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}
.talkInput {
  flex: 1;
}
.loginPrompt {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.table-container {
    height: 250px;
    overflow-y: auto;
    border-radius: 8px;
    border: 1px solid #a58960;
    padding: 1px;
}

.daySay table:hover {
    box-shadow: 0 2px 8px rgba(165, 137, 96, 0.15);
}

.listTitle{
    width: 10%;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    color: #a58960;
}
.user{
    width: 100%;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: #333;
}

.avatar{
    width: 20px;
    height: 20px;
    margin: 0 5px;
    border-radius: 50%;
    border: 2px solid #a58960;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    cursor: pointer;
}

.avatar:hover {
    transform: scale(1.1);
}

.username {
    font-weight: 600;
    color: #5a4a37;
    margin-right: 8px;
    cursor: pointer;
}

.date{
    font-size: 12px;
    color: #f1f1f1;
    margin-left: auto;
    margin-right: 5px;
    font-style: italic;
    background-color: #a58960;
    padding: 2px 8px;
    border-radius: 12px;
}

.date-wrapper {
    margin-left: auto;
    margin-right: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.delete-btn {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #a58960;
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    transition: background-color 0.2s;
}

.delete-btn:hover {
    background-color: #d64545;
}

.delete-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.content {
    display: block;
    padding: 0 12px;
    font-size: 14px;
    color: #444;
    white-space: pre-wrap;
    word-break: break-word;
}
.divide{
    height: 5px;
    border-bottom: 1px dotted #a58960;
    margin:0 10px;
}
.loading,
.no-more{
    display: flex;
    justify-content: center;
    align-items: center;
}
.loadingText,
.noMoreText{
    font-size: 14px;
    color: #a58960;
    padding: 10px 0;
}
</style>