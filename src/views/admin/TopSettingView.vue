<template>
    <div class="settingTop">
        <div class="view">
            <div class="viewCarousel">
                <el-carousel height="300px" trigger="click" motion-blur :interval="3000">
                    <el-carousel-item v-for="i in topImgs" :key="i">
                        <img :src="'/src/assets/img/top/'+i" alt="" width="100%"/>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
        <div class="operate">
            <el-button type="primary" @click="onUpload()">上传图片</el-button>
            <input ref="fileInput" style="display: none;" type="file"  accept="image/png"/>
            <div class="changeNum">
                <el-table :data="topImgs" :class="isDark ? 'dark' : ''">
                    <el-table-column prop="" label="文件名" width="200">
                        <template #default="{ row }">
                            <span>{{ row }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="img" label="图片" align="center">
                        <template #default="{ row }">
                            <img :src="'/src/assets/img/top/'+row" alt="" style="width: 200px; height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" width="250" label="操作" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" v-show="row != topImgs[0]" @click="upMove(row)">上移</el-button>
                            <el-button type="danger" @click="del(row)">删除</el-button>
                            <el-button type="primary" v-show="row != topImgs[topImgs.length-1]" @click="downMove(row)">下移</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getTopImgs,upMoveTopImg,downMoveTopImg,deleteTopImg, uploadTopImg } from "@/api/admin/other"
import { ElMessage, ElMessageBox } from "element-plus"
import { inject, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
const isDark = inject("isDark")
const topImgs = ref([])
const router = useRouter()
const upMove = async(i)=>{
    await upMoveTopImg(i).then(async(res)=>{
        let msg = res.data.msg
        if(msg == "SUCCESS"){
            router.go(0)
            ElMessage.success("图片上移成功")
        }
        else{
            ElMessage.error("操作失败")
        }
    })
}
const del = (i)=>{
    ElMessageBox.confirm("确定删除该图片吗？","提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async()=>{
        await deleteTopImg(i).then(res=>{
            let msg = res.data.msg
            if(msg == "SUCCESS"){
                router.go(0)
                ElMessage.success("图片删除成功")
            }
            else{
                ElMessage.error("操作失败")
            }
        })
    }).catch(()=>{
        ElMessage.info("已取消删除")
    })
}
const downMove = async(i)=>{
    await downMoveTopImg(i).then(res=>{
        let msg = res.data.msg
        if(msg == "SUCCESS"){
            router.go(0)
            ElMessage.success("图片下移成功")
        }
        else{
            ElMessage.error("操作失败")
        }
    })
}
const findAllTopImg = async()=>{
    await getTopImgs().then(res=>{
        let msg = res.data.msg
        if(msg == "SUCCESS"){
            topImgs.value = res.data.object
        }
        else{
            ElMessage.error("获取大屏图片失败")
        }
        
    })
}
const fileInput = ref()
const onUpload = ()=>{
    fileInput.value.click()
}
const initInput = ()=>{
  fileInput.value.addEventListener('change', function () {
    let fileInputValue = fileInput.value
    // 清除背景图片:
    if (!fileInputValue.value) {
      fileInputValue.value = ''
      return
    }
    let file = fileInputValue.files[0]
    let size = file.size
    if (size >= 5 * 1024 * 1024) {
      fileInputValue.value = ''
      ElMessage.error('文件大小超出限制(5MB)')
      return false
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      fileInputValue.value = ''
      ElMessage.error('不是有效的图片文件!')
      return
    }
    // 读取文件:
    let reader = new FileReader()
    reader.onload = function (e) {
      let data = e.target.result
      upload(data)
    }
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(file)
  })
}
const upload = async(imgData)=>{
    await uploadTopImg(imgData).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
            ElMessage.success('图片上传成功')
            topImgs.value = res.data.object
        }
        else{
            ElMessage.error('图片上传失败')
        }
    })
}
const init = ()=>{
    initInput()
    findAllTopImg()
}
onMounted(init)
</script>
<style scoped>
.settingTop{
    margin-top: 20px;
    width: 50%;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.settingTop .view{
    height: 300px;
    width: 100%;
    display: flex;
    justify-content: center;
}
.settingTop .view .viewCarousel{
    width: 600px;
    height: 100%;
}
.settingTop .operate{
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.settingTop .operate .changeNum{
    margin-top: 20px;
    width: 100%;
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
}
</style>