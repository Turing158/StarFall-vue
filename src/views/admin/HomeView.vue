<template>
    <div class="home" :class="isDark ? 'dark' : ''">
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
            <div class="item reflesh"><el-button type="primary" @click="getActuator()">刷新面板状态</el-button></div>
        </div>
        <div class="redis-info" v-loading="redisLoading">
            <div class="redis-info-header">
                <div class="redis-info-title">
                    <el-icon class="redis-icon"><Monitor /></el-icon>
                    <span>Redis 详细信息</span>
                </div>
                <div class="redis-header-actions">
                    <div class="redis-status-badge" :class="redisInfo.connected ? 'connected' : 'disconnected'">
                        <span class="status-dot"></span>
                        {{ redisInfo.connected ? '已连接' : '未连接' }}
                    </div>
                    <el-button type="primary" :loading="redisLoading" circle @click="refreshRedis" class="redis-refresh-btn">
                        <template #icon><Refresh /></template>
                    </el-button>
                </div>
            </div>
            <div class="redis-info-content" v-if="redisInfo.connected">
                <div class="redis-info-grid">
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Timer /></el-icon>
                            <span>版本与运行</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-icon"><Bell /></span>
                                <span class="info-label">Redis 版本</span>
                                <span class="info-value version">{{ redisInfo.redisVersion }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Clock /></span>
                                <span class="info-label">运行时间</span>
                                <span class="info-value">{{ redisInfo.uptimeInDays }} 天</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Monitor /></span>
                                <span class="info-label">操作系统</span>
                                <span class="info-value">{{ redisInfo.os.trim() }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Coin /></el-icon>
                            <span>内存状态</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-icon"><Box /></span>
                                <span class="info-label">内存使用</span>
                                <span class="info-value memory">{{ redisInfo.usedMemoryHuman }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Collection /></span>
                                <span class="info-label">键总数</span>
                                <span class="info-value count">{{ redisInfo.totalKeys }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><User /></el-icon>
                            <span>客户端连接</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-icon"><UserFilled /></span>
                                <span class="info-label">连接客户端</span>
                                <span class="info-value clients">{{ redisInfo.connectedClients }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Bell /></span>
                                <span class="info-label">阻塞客户端</span>
                                <span class="info-value">{{ redisInfo.blockedClients }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Connection /></span>
                                <span class="info-label">连接总数</span>
                                <span class="info-value">{{ redisInfo.totalConnectionsReceived }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Odometer /></el-icon>
                            <span>性能指标</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-icon"><Cpu /></span>
                                <span class="info-label">总命令数</span>
                                <span class="info-value commands">{{ redisInfo.totalCommandsProcessed }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Gauge /></span>
                                <span class="info-label">每秒操作</span>
                                <span class="info-value ops">{{ redisInfo.instantaneousOpsPerSec }}/s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Connection /></span>
                                <span class="info-label">Ping</span>
                                <span class="info-value ping">{{ redisInfo.ping }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="redis-info-empty" v-else>
                <el-icon class="empty-icon"><Warning /></el-icon>
                <span>Redis 未连接</span>
            </div>
        </div>
        <div class="nacos-info" v-loading="nacosLoading">
            <div class="nacos-info-header">
                <div class="nacos-info-title">
                    <el-icon class="nacos-icon"><Connection /></el-icon>
                    <span>Nacos 详细信息</span>
                </div>
                <div class="nacos-header-actions">
                    <div class="nacos-status-badge" :class="nacosInfo.connectionStatus.configServerConnected && nacosInfo.connectionStatus.discoveryServerConnected ? 'connected' : 'disconnected'">
                        <span class="status-dot"></span>
                        {{ nacosInfo.connectionStatus.configServerConnected && nacosInfo.connectionStatus.discoveryServerConnected ? '已连接' : '未连接' }}
                    </div>
                    <el-button type="primary" :loading="nacosLoading" circle @click="refreshNacos" class="nacos-refresh-btn">
                        <template #icon><Refresh /></template>
                    </el-button>
                </div>
            </div>
            <div class="nacos-info-content">
                <div class="nacos-info-grid">
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Link /></el-icon>
                            <span>连接状态</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-label">配置服务器</span>
                                <span class="info-value" :class="nacosInfo.connectionStatus.configServerConnected ? 'success' : 'error'">
                                    {{ nacosInfo.connectionStatus.configServerConnected ? '已连接' : '未连接' }}
                                </span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">发现服务器</span>
                                <span class="info-value" :class="nacosInfo.connectionStatus.discoveryServerConnected ? 'success' : 'error'">
                                    {{ nacosInfo.connectionStatus.discoveryServerConnected ? '已连接' : '未连接' }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Server /></el-icon>
                            <span>服务器地址</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-label">配置服务器</span>
                                <span class="info-value addr">{{ nacosInfo.connectionStatus.configServerAddr }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">发现服务器</span>
                                <span class="info-value addr">{{ nacosInfo.connectionStatus.discoveryServerAddr }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Collection /></el-icon>
                            <span>配置信息</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-label">配置分组</span>
                                <span class="info-value">{{ nacosInfo.configurationInfo.group || 'N/A' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">更新时间</span>
                                <span class="info-value time">{{ nacosInfo.timestamp ? nacosInfo.timestamp.split('T')[0] : 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Monitor /></el-icon>
                            <span>服务发现</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-label">服务总数</span>
                                <span class="info-value count">{{ nacosInfo.serviceDiscoveryInfo.totalServiceCount }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">服务列表</span>
                                <span class="info-value services">{{ nacosInfo.serviceDiscoveryInfo.allServiceNames.join(', ') || '无' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="config-content" v-if="nacosInfo.configurationInfo.allConfigs && Object.keys(nacosInfo.configurationInfo.allConfigs).length > 0">
                    <div class="config-content-header">
                        <el-icon><Document /></el-icon>
                        <span>配置文件内容</span>
                    </div>
                    <div class="config-list">
                        <div class="config-item" v-for="(content, fileName) in nacosInfo.configurationInfo.allConfigs" :key="fileName">
                            <div class="config-item-header">
                                <el-icon><Tickets /></el-icon>
                                <span class="config-file-name">{{ fileName }}</span>
                            </div>
                            <pre class="config-pre">{{ content }}</pre>
                        </div>
                    </div>
                </div>
                <div class="service-instances" v-if="nacosInfo.serviceDiscoveryInfo.serviceDetails && nacosInfo.serviceDiscoveryInfo.totalServiceCount > 0">
                    <div class="service-instances-header">
                        <el-icon><Tickets /></el-icon>
                        <span>服务实例详情</span>
                    </div>
                    <div class="service-instance-card" v-for="(instances, serviceName) in nacosInfo.serviceDiscoveryInfo.serviceDetails" :key="serviceName">
                        <div class="service-name">{{ serviceName }}</div>
                        <div class="instance-list">
                            <div class="instance-item" v-for="(instance, index) in instances" :key="index">
                                <div class="instance-header">
                                    <span class="instance-ip">{{ instance.ip }}:{{ instance.port }}</span>
                                    <el-tag :type="instance.healthy ? 'success' : 'danger'" size="small">
                                        {{ instance.healthy ? '健康' : '不健康' }}
                                    </el-tag>
                                </div>
                                <div class="instance-meta" v-if="instance.metadata">
                                    <span class="meta-item" v-if="instance.metadata.IPv6">
                                        <el-icon><LocationInformation /></el-icon>
                                        {{ instance.metadata.IPv6 }}
                                    </span>
                                    <span class="meta-item" v-if="instance.weight">
                                        <el-icon><DataLine /></el-icon>
                                        权重: {{ instance.weight }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="minio-info" v-loading="minioLoading">
            <div class="minio-info-header">
                <div class="minio-info-title">
                    <el-icon class="minio-icon"><Box /></el-icon>
                    <span>Minio 详细信息</span>
                </div>
                <div class="minio-header-actions">
                    <div class="minio-status-badge" :class="minioInfo.connected ? 'connected' : 'disconnected'">
                        <span class="status-dot"></span>
                        {{ minioInfo.connected ? '已连接' : '未连接' }}
                    </div>
                    <el-button type="primary" :loading="minioLoading" circle @click="refreshMinio" class="minio-refresh-btn">
                        <template #icon><Refresh /></template>
                    </el-button>
                </div>
            </div>
            <div class="minio-info-content" v-if="minioInfo.connected">
                <div class="minio-info-grid">
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Coin /></el-icon>
                            <span>存储状态</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-icon"><Box /></span>
                                <span class="info-label">存储文件总数</span>
                                <span class="info-value count">{{ minioInfo.totalCount }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-icon"><Clock /></span>
                                <span class="info-label">检测时间</span>
                                <span class="info-value time">{{ formatTimestamp(minioInfo.timestamp) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <el-icon><Bell /></el-icon>
                            <span>状态信息</span>
                        </div>
                        <div class="info-card-body">
                            <div class="info-row">
                                <span class="info-icon"><Link /></span>
                                <span class="info-label">连接状态</span>
                                <span class="info-value" :class="minioInfo.connected ? 'success' : 'error'">
                                    {{ minioInfo.connected ? '正常' : '异常' }}
                                </span>
                            </div>
                            <div class="info-row" v-if="minioInfo.errorMessage">
                                <span class="info-icon"><Bell /></span>
                                <span class="info-label">错误信息</span>
                                <span class="info-value error">{{ minioInfo.errorMessage }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="minio-bucket-section">
                <div class="minio-bucket-header">
                    <el-icon><Collection /></el-icon>
                    <span>存储文件列表</span>
                </div>
                <el-table :class="isDark ? 'dark' : ''" :data="minioFileList" v-loading="minioBucketLoading" class="minio-bucket-table">
                    <el-table-column prop="name" label="文件名称" min-width="200" show-overflow-tooltip />
                    <el-table-column prop="size" label="文件大小" width="120" :formatter="(row)=>formatFileSize(row.size)" />
                    <el-table-column prop="lastModified" label="最后修改" width="200" :formatter="(row)=>formatTimestamp(row.lastModified)" />
                    <el-table-column prop="contentType" label="文件类型" width="200" />
                </el-table>
                <div class="minio-bucket-pagination">
                    <el-pagination
                        background
                        :class="isDark? 'dark':''"
                        v-model:current-page="minioBucketPagination.currentPage"
                        :page-size="10"
                        :total="minioBucketPagination.total"
                        layout="total, prev, pager, next"
                        @current-change="handleMinioBucketPageChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getCPUUsed, getHealth, getJVMMemoryTotal, getJVMMemoryUsed, getMinioStatus, getMinioBuckets, getNacosStatus, getRedisStatus, getRequestActive } from "@/api/admin/other";
import { reactive, ref,inject, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { Refresh, Connection, Link, Collection, Document, Tickets, LocationInformation, DataLine, Timer, Coin, User, Odometer, Box, Clock, Monitor, Odometer as Gauge, UserFilled, Lock, Cpu, TrendCharts, Bell } from '@element-plus/icons-vue'
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
const redisInfo = reactive({
    ping: '',
    connected: false,
    redisVersion: '',
    os: '',
    uptimeInDays: '',
    usedMemoryHuman: '',
    totalKeys: 0,
    totalConnectionsReceived: '',
    totalCommandsProcessed: '',
    instantaneousOpsPerSec: '',
    connectedClients: '',
    blockedClients: '',
    error: ''
})
const redisLoading = ref(false)
const nacosInfo = reactive({
    connectionStatus: {
        configServerConnected: false,
        discoveryServerConnected: false,
        configServerAddr: '',
        discoveryServerAddr: '',
        namespace: '',
        group: ''
    },
    configurationInfo: {
        dataId: '',
        group: '',
        allConfigs: {},
        rawConfigContent: ''
    },
    serviceDiscoveryInfo: {
        allServiceNames: [],
        serviceDetails: {},
        totalServiceCount: 0
    },
    timestamp: ''
})
const nacosLoading = ref(false)
const minioInfo = reactive({
    connected: false,
    errorMessage: '',
    buckets: [],
    totalCount: 0,
    timestamp: ''
})
const minioLoading = ref(false)
const minioFileList = ref([])
const minioBucketLoading = ref(false)
const minioBucketPagination = reactive({
    currentPage: 1,
    total: 0,
})
const formatTimestamp = (timestamp)=>{
    if(!timestamp) return 'N/A'
    return timestamp.split('T')[0] + ' ' + timestamp.split('T')[1].split('[')[0].split('.')[0]
}
const formatFileSize = (bytes)=>{
    if(!bytes && bytes !== 0) return 'N/A'
    if(bytes < 1024) return bytes + ' B'
    if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if(bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}


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
const redisStatus = async()=>{
    redisLoading.value = true
    await getRedisStatus().then(res=>{
        let data = res.data.object
        console.log(data)
        redisState.value = (data.status === 'UP')
        if(data.connected){
            redisInfo.ping = data.ping
            redisInfo.connected = data.connected
            redisInfo.redisVersion = data.redisVersion
            redisInfo.os = data.os
            redisInfo.uptimeInDays = data.uptimeInDays
            redisInfo.usedMemoryHuman = data.usedMemoryHuman
            redisInfo.totalKeys = data.totalKeys || 0
            redisInfo.totalConnectionsReceived = data.totalConnectionsReceived
            redisInfo.totalCommandsProcessed = data.totalCommandsProcessed
            redisInfo.instantaneousOpsPerSec = data.instantaneousOpsPerSec
            redisInfo.connectedClients = data.connectedClients
            redisInfo.blockedClients = data.blockedClients
            redisInfo.error = data.error
        }
    }).finally(()=>{
        redisLoading.value = false
    })
}
const refreshRedis = ()=>{
    redisStatus()
}
const nacosStatus = async()=>{
    nacosLoading.value = true
    await getNacosStatus().then(res=>{
        let data = res.data.object
        console.log(data)
        if(data.connectionStatus){
            nacosInfo.connectionStatus.configServerConnected = data.connectionStatus.configServerConnected
            nacosInfo.connectionStatus.discoveryServerConnected = data.connectionStatus.discoveryServerConnected
            nacosInfo.connectionStatus.configServerAddr = data.connectionStatus.configServerAddr
            nacosInfo.connectionStatus.discoveryServerAddr = data.connectionStatus.discoveryServerAddr
            nacosInfo.connectionStatus.namespace = data.connectionStatus.namespace || ''
            nacosInfo.connectionStatus.group = data.connectionStatus.group
        }
        if(data.configurationInfo){
            nacosInfo.configurationInfo.dataId = data.configurationInfo.dataId || ''
            nacosInfo.configurationInfo.group = data.configurationInfo.group || ''
            nacosInfo.configurationInfo.allConfigs = data.configurationInfo.allConfigs || {}
            nacosInfo.configurationInfo.rawConfigContent = data.configurationInfo.rawConfigContent || ''
        }
        if(data.serviceDiscoveryInfo){
            nacosInfo.serviceDiscoveryInfo.allServiceNames = data.serviceDiscoveryInfo.allServiceNames || []
            nacosInfo.serviceDiscoveryInfo.serviceDetails = data.serviceDiscoveryInfo.serviceDetails || {}
            nacosInfo.serviceDiscoveryInfo.totalServiceCount = data.serviceDiscoveryInfo.totalServiceCount || 0
        }
        nacosInfo.timestamp = data.timestamp || ''
    }).finally(()=>{
        nacosLoading.value = false
    })
}
const refreshNacos = ()=>{
    nacosStatus()
}
const minioStatus = async()=>{
    minioLoading.value = true
    await getMinioStatus().then(res=>{
        let data = res.data.object
        console.log(data)
        minioInfo.connected = data.connected
        minioInfo.errorMessage = data.errorMessage || ''
        minioInfo.buckets = data.buckets || []
        minioInfo.totalBuckets = data.totalBuckets || 0
        minioInfo.timestamp = data.timestamp || ''
    }).finally(()=>{
        minioLoading.value = false
        if(minioInfo.connected){
            getMinioBucketList()
        }
    })
}
const refreshMinio = async ()=>{
    await minioStatus()
    if(minioInfo.connected){
        minioBucketPagination.currentPage = 1
        getMinioBucketList()
    }
}
const getMinioBucketList = ()=>{
    minioBucketLoading.value = true
    getMinioBuckets('starfall', minioBucketPagination.currentPage, 10).then(res=>{
        let data = res.data.object
        minioFileList.value = data.objects || []
        minioInfo.totalCount = data.totalCount || 0
        minioBucketPagination.total = data.totalCount || 0
    }).finally(()=>{
        minioBucketLoading.value = false
    })
}
const handleMinioBucketPageChange = (page)=>{
    minioBucketPagination.currentPage = page

    getMinioBucketList()
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
    redisStatus()
    nacosStatus()
    minioStatus()
    getMinioBucketList()
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
.redis-info{
    margin-top: 20px;
    width: 95%;
    padding: 20px;
    background: #00000005;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
.redis-info-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #13131355;
}
.redis-info-title{
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #131313;
}
.redis-icon{
    font-size: 22px;
    color: #996b27aa;
}
.redis-status-badge{
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}
.redis-header-actions{
    display: flex;
    align-items: center;
    gap: 12px;
}
.redis-refresh-btn{
    box-shadow: 0 2px 8px 0 rgba(64, 158, 255, 0.3);
}
.redis-status-badge.connected{
    background: linear-gradient(135deg, #67C23A15, #67C23A25);
    color: #67C23A;
}
.redis-status-badge.disconnected{
    background: linear-gradient(135deg, #F56C6C15, #F56C6C25);
    color: #996b27aa;
}
.status-dot{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}
.redis-status-badge.connected .status-dot{
    background: #67C23A;
    box-shadow: 0 0 8px #67C23A;
}
.redis-status-badge.disconnected .status-dot{
    background: #996b27aa;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
.redis-info-content{
    width: 100%;
}
.redis-info-grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
}
.info-card{
    background: #00000005;
    border-radius: 10px;
    padding: 16px;
    border: 1px solid #00000010;
    transition: all 0.3s ease;
}
.info-card:hover{
    border-color: #00000050;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}
.info-card-header{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #00000010;
    font-size: 14px;
    font-weight: 600;
    color: #131313;
}
.info-card-header .el-icon{
    font-size: 16px;
    color: #131313;
}
.info-card-body{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.info-row{
    display: flex;
    align-items: center;
    gap: 8px;
}
.info-icon{
    display: flex;
    align-items: center;
    color: #131313aa;
    font-size: 14px;
}
.info-label{
    flex: 1;
    font-size: 13px;
    color: #131313aa;
}
.info-value{
    font-size: 14px;
    font-weight: 600;
    color: #131313aa;
}
.info-value.version{
    color: #131313aa;
    font-family: Monaco, Consolas, monospace;
}
.info-value.memory{
    color: #131313aa;
}
.info-value.clients{
    color: #996b27aa;
}
.info-value.commands{
    color: #67C23A;
}
.info-value.ops{
    color: #131313aa;
    font-family: Monaco, Consolas, monospace;
}
.info-value.ping{
    color: #67C23A;
    font-weight: 700;
}
.info-value.warning{
    color: #996b27aa;
}
.redis-info-empty{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #131313aa;
}
.empty-icon{
    font-size: 48px;
    margin-bottom: 15px;
    color: #131313aa;
}
.nacos-info{
    margin-top: 20px;
    width: 95%;
    padding: 20px;
    background: #00000005;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
.nacos-info-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #13131355;
}
.nacos-info-title{
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #131313;
}
.nacos-icon{
    font-size: 22px;
    color: #1e5994aa;
}
.nacos-header-actions{
    display: flex;
    align-items: center;
    gap: 12px;
}
.nacos-status-badge{
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}
.nacos-status-badge.connected{
    background: linear-gradient(135deg, #67C23A15, #67C23A25);
    color: #67C23A;
}
.nacos-status-badge.disconnected{
    background: linear-gradient(135deg, #F56C6C15, #F56C6C25);
    color: #996b27aa;
}
.nacos-status-badge .status-dot{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}
.nacos-status-badge.connected .status-dot{
    background: #67C23A;
    box-shadow: 0 0 8px #67C23A;
}
.nacos-status-badge.disconnected .status-dot{
    background: #996b27aa;
}
.nacos-refresh-btn{
    box-shadow: 0 2px 8px 0 rgba(64, 158, 255, 0.3);
}
.nacos-info-content{
    width: 100%;
}
.nacos-info-grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}
.info-value.success{
    color: #67C23A;
}
.info-value.error{
    color: #b12b2baa;
}
.info-value.addr{
    color: #1e5994aa;
    font-family: Monaco, Consolas, monospace;
}
.info-value.config{
    color: #996b27aa;
}
.info-value.time{
    color: #13131388;
}
.info-value.count{
    color: #1e5994aa;
    font-weight: 700;
}
.info-value.services{
    color: #67C23A;
}
.config-content{
    margin-top: 20px;
    background: #00000005;
    border-radius: 10px;
    padding: 16px;
    border: 1px solid #00000050;
}
.config-content-header{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #131313;
}
.config-pre{
    user-select: text;
    background: #00000005;
    padding: 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: Monaco, Consolas, monospace;
    color: #131313aa;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
}
.config-list{
    max-height: 400px;
    overflow-y: auto;
}
.config-item{
    margin-bottom: 16px;
}
.config-item:last-child{
    margin-bottom: 0;
}
.config-item-header{
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #1e5994aa;
}
.config-file-name{
    font-weight: 600;
    margin: 0;
}
.service-instances{
    margin-top: 20px;
    background: #00000005;
    border-radius: 10px;
    padding: 16px;
    border: 1px solid #00000050;
    max-height: 300px;
    overflow-y: auto;
}
.service-instances-header{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #131313;
}
.service-instance-card{
    margin-bottom: 16px;
    padding: 12px;
    background: #00000005;
    border-radius: 8px;
}
.service-instance-card:last-child{
    margin-bottom: 0;
}
.service-name{
    font-weight: 600;
    color: #131313;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #13131355;
}
.instance-list{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.instance-item{
    padding: 10px;
    background: #00000005;
    border-radius: 6px;
}
.instance-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}
.instance-ip{
    font-family: Monaco, Consolas, monospace;
    font-size: 13px;
    color: #131313aa;
}
.instance-meta{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
.meta-item{
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #131313aa;
}
.meta-item .el-icon{
    font-size: 12px;
}
.minio-info{
    margin-top: 20px;
    width: 95%;
    padding: 20px;
    background: #00000005;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
.minio-info-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #13131355;
}
.minio-info-title{
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #131313;
}
.minio-icon{
    font-size: 22px;
    color: #996b27aa;
}
.minio-header-actions{
    display: flex;
    align-items: center;
    gap: 12px;
}
.minio-status-badge{
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}
.minio-status-badge.connected{
    background: linear-gradient(135deg, #67C23A15, #67C23A25);
    color: #67C23A;
}
.minio-status-badge.disconnected{
    background: linear-gradient(135deg, #F56C6C15, #F56C6C25);
    color: #996b27aa;
}
.minio-status-badge .status-dot{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}
.minio-status-badge.connected .status-dot{
    background: #67C23A;
    box-shadow: 0 0 8px #67C23A;
}
.minio-status-badge.disconnected .status-dot{
    background: #996b27aa;
}
.minio-refresh-btn{
    box-shadow: 0 2px 8px 0 rgba(64, 158, 255, 0.3);
}
.minio-info-content{
    width: 100%;
}
.minio-info-grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
}
.minio-bucket-section{
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #13131355;
}
.minio-bucket-header{
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #131313;
    margin-bottom: 16px;
}
.minio-bucket-table{
    border-radius: 8px;
    overflow: hidden;
}
.minio-bucket-pagination{
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}
.minio-info-empty{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #131313aa;
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