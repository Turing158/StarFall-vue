<template>
    <div class="home">
        <div class="title"><span>首页</span> <span>Home</span></div>
        <p>Welcome to the admin panel</p>
        <div class="actuatorPanel">
            <el-progress type="dashboard" :percentage="diskPercent" :color="colors" >
                <template #default="{ percentage }">
                    <span class="progressPercent">{{ percentage }}%</span>
                    <br>
                    <span class="progressTitle">磁盘使用量</span>
                    <br>
                    <span class="progressData">{{ diskInfo.used }}/{{ diskInfo.total }}</span>
                </template>
            </el-progress>
            <div class="empty"></div>
            <el-progress type="dashboard" :percentage="requestActivePercent" :color="colors" >
                <template #default="{ percentage }">
                    <span class="progressPercent">{{ percentage }}%</span>
                    <br>
                    <span class="progressTitle">请求活跃数\负载</span>
                    <br>
                    <span class="progressData">{{ requestActiveInfo.activeCount }}/{{ requestActiveInfo.activeTime }}</span>
                </template>
            </el-progress>
            <div class="empty"></div>
            <el-progress type="dashboard" :percentage="jvmMemoryPercent" :color="colors" >
                <template #default="{ percentage }">
                    <span class="progressPercent">{{ percentage }}%</span>
                    <br>
                    <span class="progressTitle">JVM内存使用量</span>
                    <br>
                    <span class="progressData">{{ jvmMemoryInfo.used }}/{{ jvmMemoryInfo.total }}</span>
                </template>
            </el-progress>
            <div class="empty"></div>
            <el-progress type="dashboard" :percentage="CPUStatePercent" :color="colors" >
                <template #default="{ percentage }">
                    <span class="progressPercent">{{ percentage }}%</span>
                    <br>
                    <span class="progressTitle">CPU使用量</span>
                    <br>
                    <span class="progressData">{{ CPUStateInfo.used }}/{{ CPUStateInfo.total }}</span>
                </template>
            </el-progress>
        </div>
        <div class="actuatorInfo">
            <div class="item"><span>整体 状态</span> <el-tag :type="AllState ? 'success' : 'danger'" :effect="isDark ? 'dark' : 'light'">{{ AllState ? '正常' : '异常' }}</el-tag></div>
            <div class="item"><span>{{ dbName }} 数据库 状态</span> <el-tag :type="dbState ? 'success' : 'danger'" :effect="isDark ? 'dark' : 'light'">{{ dbState ? '正常' : '异常' }}</el-tag></div>
            <div class="item"><span>邮箱服务 状态</span> <el-tag :type="mailState ? 'success' : 'danger'" :effect="isDark ? 'dark' : 'light'">{{ mailState ? '正常' : '异常' }}</el-tag></div>
            <div class="item"><span>Redis 状态</span> <el-tag :type="redisState ? 'success' : 'danger'" :effect="isDark ? 'dark' : 'light'">{{ redisState ? '正常' : '异常' }}</el-tag></div>
            <div class="item reflesh"><el-button type="primary" @click="getActuator()">刷新面板状态</el-button></div>
        </div>
        <div class="imgSettingOperate">
            <el-segmented :class="isDark ? 'dark' : ''" v-model="imgSettingPage" :options="options" block @change="imgSettingPageChange"/>
        </div>
        <div class="imgSetting" :style="{transform: 'translateX('+(imgSettingPage==='顶部图片设置' ? '0' : 'calc(-50% - 20px)')+')'}">
            <TopSettingView />
            <div>
                <div style="width:40px"></div>
            </div>
            <TopicAdSettingView />
        </div>
    </div>
</template>
<script setup>
import TopSettingView from "./TopSettingView.vue";
import TopicAdSettingView from "./TopicAdSettingView.vue";
import { getCPUUsed, getHealth, getJVMMemoryTotal, getJVMMemoryUsed, getRequestActive } from "@/api/admin/other";
import { reactive, ref,inject, onMounted } from "vue"
const isDark = inject('isDark')

const imgSettingPage = ref(localStorage.getItem('adminImgSettingPage') || '顶部图片设置')
const options = ["顶部图片设置", "话题广告设置"]
const imgSettingPageChange = (val)=>{
    localStorage.setItem('adminImgSettingPage', val)
    imgSettingPage.value = val
}

const diskPercent = ref(0)
const diskInfo = reactive({
    total: '0',
    used: '0'
})
const requestActivePercent = ref(0)
const requestActiveInfo = reactive({
    activeCount: '0',
    activeTime: '0'
})
const jvmMemoryPercent = ref(0)
const jvmMemoryInfo = reactive({
    total: '0',
    used: '0'
})
const CPUStatePercent = ref(0)
const CPUStateInfo = reactive({
    total: '0',
    used: '0'
})
const AllState = ref(true)
const dbState = ref(true)
const dbName = ref('')
const mailState = ref(true)
const redisState = ref(true)


const colors = [
  { color: '#3bbb3b', percentage: 20 },
  { color: '#308fbb', percentage: 40 },
  { color: '#c9cc15', percentage: 60 },
  { color: '#ceae21', percentage: 80 },
  { color: '#9b1717', percentage: 100 },
]
const fixMemory = (num)=>{
    if(num >= 1024 * 1024 * 1024 * 1024){
        return (num / 1024 / 1024 / 1024 / 1024).toFixed(0) + 'TB'
    }
    else if(num >= 1024 * 1024 * 1024){
        return (num / 1024 / 1024 / 1024).toFixed(0) + 'GB'
    }
    else if(num >= 1024 * 1024){
        return (num / 1024 / 1024).toFixed(0) + 'MB'
    }else if(num >= 1024){
        return (num / 1024).toFixed(0) + 'KB'
    }else{
        return num + 'B'
    }
}
const health = async()=>{
    await getHealth().then(res=>{
        let data = res.data
        AllState.value = (data.status === 'UP')
        let components = data.components
        dbState.value = (components.db.status === 'UP')
        dbName.value = components.db.details.database
        mailState.value = (components.mail.status === 'UP')
        redisState.value = (components.redis.status === 'UP')
        let disk = components.diskSpace.details
        diskInfo.total = fixMemory(disk.total)
        diskInfo.used = fixMemory(disk.total - disk.free)
        diskPercent.value = Number(((disk.total - disk.free) / disk.total * 100).toFixed(0))
    })
}
const fixTime = (num)=>{
    if(num >= 3600){
        return (num / 3600).toFixed(0) + 'h'
    }
    else if(num >= 60){
        return (num / 60).toFixed(0) + 'min'
    }
    else if(num <= 1){
        return (num*1000).toFixed(2) + 'ms'
    }
    return num + 's'
}
const requestActive = async()=>{
    await getRequestActive().then(res=>{
        let data = res.data.measurements
        requestActiveInfo.activeCount = data[0].value
        requestActiveInfo.activeTime = fixTime(data[1].value)
        requestActivePercent.value = Number((data[1].value  * 100).toFixed(2))
    })
}
const JVMMemory = async()=>{
    let total = 0
    let used = 0
    await getJVMMemoryTotal().then(res=>total = res.data.measurements[0].value)
    await getJVMMemoryUsed().then(res=>used = res.data.measurements[0].value)
    jvmMemoryInfo.total = fixMemory(total)
    jvmMemoryInfo.used = fixMemory(used)
    jvmMemoryPercent.value = Number((used / total * 100).toFixed(2))
}   
const CPUInfo = async()=>{
    await getCPUUsed().then(res=>CPUStatePercent.value = Number((res.data.measurements[0].value * 100).toFixed(2)))
}
const getActuator = ()=>{
    health()
    requestActive()
    CPUInfo()
    JVMMemory()
}
onMounted(getActuator)
</script>
<style scoped>
.home {
  width: calc(100% - 40px);
  margin: 20px;
  overflow-x: hidden;
}
.title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
}
.title span:nth-child(2){
    position: relative;
    top: 3px;
    font-size: 16px;
}
.actuatorPanel{
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.empty{
    width: 80px;
}
.progressPercent{
    font-size: 24px;
    font-weight: bold;
    color: #aaa;
}
.progressTitle{
    font-size: 12px;
    color: #777;
}
.progressData{
    font-size: 12px;
    color: #666;
}
.actuatorInfo{
    margin-top: 20px;
    width: 100%;
    height: 100px;
}
.actuatorInfo .item{
    float: left;
    margin: 10px 30px;
    min-width: fit-content;
}
.reflesh{
    position: relative;
    top: -5px;
}
.imgSettingOperate{
    margin-top: 20px;
    width: 100%;
    height: 40px;
}
.imgSetting{
    width: 200%;
    display: flex;
    transform: translateX(0);
    transition: all 200ms;
}
.dark{
    --el-segmented-bg-color: #2b2b2b;
    --el-segmented-color: #dedede;
    --el-segmented-item-hover-bg-color: #262626;
    --el-segmented-item-hover-color: #dedede;
    --el-segmented-item-active-bg-color: #222;
    --el-segmented-item-selected-bg-color: #1d1d1d;
}
</style>