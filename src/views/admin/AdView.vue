<template>
  <div class="ad" :class="isDark ? 'dark' : ''">
    <h2>广告管理</h2>
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="openDialog(0)" plain>添加广告</el-button>
    </div>
    <input style="display: none;" ref="fileInput" type="file" accept="image/png"/>
    <!-- 广告列表表格 -->
    <el-table :data="ads" :class="isDark ? 'dark' : ''">
      <el-table-column label="图片" prop="file" width="120" align="center">
        <template #default="{ row }">
          <img :src="adPictureApi + row.file" style="width: 100px; height: 60px; object-fit: cover; border: 1px solid #ccc; cursor: pointer;" @click="previewImage(row.file)" />
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="date" width="180" />
      <el-table-column label="链接" prop="link" min-width="200" />
      <el-table-column label="位置" prop="position" width="120">
        <template #default="{ row }">
          <span>{{ positionOptions[row.position] || row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="顺序" prop="sequence" width="80" />
      <el-table-column width="250" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="info" @click="goToLink(row.link)" plain>前往</el-button>
          <el-button type="primary" @click="openDialog(row)" plain>编辑</el-button>
          <el-button type="danger" @click="onDel(row.id)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <div class="page">
      <el-pagination
        :class="isDark ? 'dark' : ''"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="5"
        layout="total, prev, pager, next"
        background
        :total="total" />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      :class="isDark ? 'dark' : ''"
      v-model="editPage"
      width="600"
      :title="dialogTitle"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialogContent">
        <el-form ref="formInput" inline label-position="top" :rules="rules" :model="ad">
          <el-form-item label="广告图片" prop="file">
            <div class="avatar-container" @click="model === 'add' ? fileInput.click() : ''" :style="{ cursor: model === 'add' ? 'pointer' : 'default' }">
              <img v-if="ad.file" :src="ad.file.includes('data:image/') ? ad.file : adPictureApi + ad.file" class="avatar" />
              <img v-if="ad.file" :src="ad.file.includes('data:image/') ? ad.file : adPictureApi + ad.file" class="avatar-full-preview" />
              <div v-else class="avatar-uploader-placeholder">
                <i class="el-icon-plus"></i>
                <span>{{ model === 'add' ? '点击上传图片' : '编辑模式下不可修改' }}</span>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item label="发布日期" prop="date">
            <el-date-picker
              type="date"
              v-model="ad.date"
              placeholder="请选择发布日期"
              style="width: 200px;"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="广告链接" prop="link">
            <el-input v-model="ad.link" placeholder="请输入广告链接" style="width: 400px;"></el-input>
          </el-form-item>
          
          <el-form-item label="广告位置" prop="position">
            <el-select v-model="ad.position" placeholder="请选择广告位置" style="width: 200px;" :disabled="model === 'edit'">
              <el-option
                v-for="(value, key) in positionOptions"
                :key="key"
                :label="value"
                :value="key"
              ></el-option>
            </el-select>
            <div v-if="model === 'edit'" style="font-size: 12px; color: #999; margin-top: 4px;">编辑模式下不可修改</div>
          </el-form-item>
          
          <el-form-item label="显示顺序" prop="sequence">
            <el-input
              type="number"
              v-model="ad.sequence"
              placeholder="请输入显示顺序"
              style="width: 200px;"
              :min="1"
              :max="ads.length + (model === 'add' ? 1 : 0)"
            ></el-input>
            <div style="font-size: 12px; color: #999; margin-top: 4px;">直接输入数字调整顺序</div>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button type="danger"  @click="clear()" plain>取 消</el-button>
        <el-button type="primary" @click="confirm()" plain>确 定</el-button>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog
      :class="isDark ? 'dark' : ''"
      v-model="previewVisible"
      title="图片预览"
      width="800px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <img :src="previewImageUrl" style="width: 100%; max-height: 600px; object-fit: contain;" />
      <template #footer>
        <el-button type="primary" @click="previewVisible = false" plain>关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { findAllAdvertisement, adPictureApi, updateAdvertisement, addAdvertisement, deleteAdvertisement } from '@/api/admin/home';
import { useRouter } from 'vue-router';

const isDark = inject('isDark');

const ads = ref([]);
const total = ref(0);
const page = ref(1);
const ad = ref({
  id: '',
  file: '',
  date: '',
  link: '',
  position: '',
  sequence: 0
});
const editPage = ref(false);
const dialogTitle = ref('');
const model = ref('');
const formInput = ref();
const fileInput = ref();

const previewVisible = ref(false);
const previewImageUrl = ref('');

const positionOptions = {
  'home': '主页顶部',
  'resource': '资源',
  'talk': '有话说'
};

const rules = reactive({
  file: [
    { required: true, message: '请上传广告图片', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择发布日期', trigger: 'blur' }
  ],
  link: [
    { required: true, message: '请输入广告链接', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请选择广告位置', trigger: 'blur' }
  ],
  sequence: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' }
  ]
});

const handleCurrentChange = (e) => {
  page.value = e;
  getAdList();
};

const getAdList = async () => {
  await findAllAdvertisement(page.value).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      ads.value = res.data.object || [];
      total.value = res.data.num || 0;
    } else {
      ElMessage.error('获取广告列表失败！');
    }
  })
  .catch(err=>{
    ElMessage.error('服务异常');
  })
};

const openDialog = (e) => {
  clear();
  if (e === 0) {
    dialogTitle.value = '添加广告';
    model.value = 'add';
    ad.value.sequence = 1;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    ad.value.date = `${year}-${month}-${day}`;
  } else {
    dialogTitle.value = '编辑广告';
    model.value = 'edit';
    const editedAd = { ...e };
    editedAd.sequence = Number(editedAd.sequence);
    ad.value = editedAd;
  }
  editPage.value = true;
};

const confirm = async () => {
  formInput.value.validate(async (valid) => {
    if (valid) {
      if (model.value === 'add') {
        if (ad.value.file.includes('data:image/')) {
          console.log(ad.value)
          await addAdvertisement(ad.value)
          .then(res=>{
            console.log(res)
            let msg = res.data.msg
            if(msg === 'SUCCESS'){
              ElMessage.success('广告添加成功！');
            }
            else{
              ElMessage.error('广告添加失败！');
            }
          })
          .catch(err=>{
            console.log(err) 
            ElMessage.error('服务异常');
          })
          clear();
          getAdList();
        }
      } else if (model.value === 'edit') {
        ad.value.file = ""
        await updateAdvertisement(ad.value)
        .then(res=>{
          console.log(res)
          let msg = res.data.msg
          if(msg === 'SUCCESS'){
            ElMessage.success('广告更新成功！');
          }
          else{
            ElMessage.error('广告更新失败！');
          }
        })
        .catch(err=>{
          console.log(err) 
          ElMessage.error('服务异常');
        })
        clear();
        getAdList();
      }
    }
  });
};

const onDel = (id) => {
  ElMessageBox.confirm('确定要删除该广告吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteAdvertisement(id).then(res=>{
      let msg = res.data.msg
      if(msg === 'SUCCESS'){
        ElMessage.success('删除成功！');
      }
      else{
        ElMessage.error('删除失败！');
      }
    })
    .catch(err=>{
      console.log(err) 
      ElMessage.error('服务异常');
    })
    getAdList();
  })
};

// 清空表单
const clear = () => {
  editPage.value = false;
  ad.value = {
    file: '',
    date: '',
    link: '',
    position: '',
    sequence: 0
  };
};
const router = useRouter();
const goToLink = (link) => {
  router.push(link)
};

const previewImage = (fileName) => {
  previewImageUrl.value = adPictureApi + fileName;
  previewVisible.value = true;
};

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
    if (size >= 3 * 1024 * 1024) {
      fileInputValue.value = ''
      ElMessage.error('文件大小超出限制(3MB)')
      return false
    }
    if (!['image/png'].includes(file.type)) {
      fileInputValue.value = ''
      ElMessage.error('不是有效的图片文件!')
      return
    }
    // 读取文件:
    let reader = new FileReader()
    reader.onload = function (e) {
      let data = e.target.result
      ad.value.file = data
    }
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(file)
  })
}

onMounted(async() => {
  await getAdList();
  initInput();
});

</script>

<style scoped>
.ad {
  padding: 20px;
  border: 0;
}

.page {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar-uploader-placeholder {
  font-size: 14px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.avatar-uploader-placeholder i {
  font-size: 28px;
  margin-bottom: 8px;
}

.avatar-uploader-placeholder span {
  font-size: 12px;
  line-height: 1.4;
  padding: 0 10px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
  cursor: pointer;
  z-index: 1;
  position: relative;
}

.avatar-full-preview {
  position: absolute;
  top: -10px;
  left: 130px;
  max-width: 300px;
  max-height: 300px;
  border: 2px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 5px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
  pointer-events: none;
}

.avatar-container:hover .avatar-full-preview {
  opacity: 1;
  visibility: visible;
}

.dialogContent {
  padding: 10px;
}
</style>
