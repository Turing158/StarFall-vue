<template>
    <div class="home-talk" :class="isDark ? 'dark' : ''">
    <h2>每日一言</h2>
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="openDialog(0)" plain>添加每日一言</el-button>
    </div>

    <!-- 每日一言列表表格 -->
    <el-table :data="homeTalks" :class="isDark ? 'dark' : ''">
      <el-table-column label="ID" prop="id" width="220" />
      <el-table-column label="日期" prop="date" width="200" />
      <el-table-column label="用户" width="200">
        <template #default="{ row }">
          {{ row.name }}({{ row.user }})
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" min-width="400">
        <template #default="{ row }">
          <div class="content-cell" :title="row.content">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" fixed="right">
        <template #header>
          <el-input v-model="keyword" size="small" placeholder="Type to search" @input="search" title="可搜日期、用户和内容"/>
        </template>
        <template #default="{ row }">
          <el-button type="primary" @click="openDialog(row)" plain>编辑</el-button>
          <el-button type="danger" @click="onDel(row.id)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="page">
      <el-pagination
        :class="isDark? 'dark':''"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="10"
        layout="total, prev, pager, next"
        background
        :total="total" />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      :class="isDark ? 'dark' : ''"
      v-model="dialogVisible"
      width="600"
      :title="dialogTitle"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialogContent">
        <el-form ref="formRef" inline label-position="top" :rules="rules" :model="homeTalk">
          <el-form-item label="ID" prop="id">
            <el-input 
              v-model="homeTalk.id" 
              placeholder="请输入ID(为空自动生成)" 
              style="width: 200px;"
              :disabled="model === 'edit'"
            ></el-input>
            <div v-if="model === 'edit'" style="color: #909399; font-size: 12px; margin-top: 5px;">
              编辑模式下ID不可修改
            </div>
          </el-form-item>
          
          <el-form-item label="日期" prop="date">
            <el-date-picker
              type="date"
              v-model="homeTalk.date"
              placeholder="请选择日期"
              style="width: 200px;"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="用户" prop="user">
            <el-select
              v-model="homeTalk.user"
              style="width: 200px;"
              placeholder="请输入用户"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethod">
              <el-option
                v-for="item in userSelect"
                :key="item.user"
                :label="item.user"
                :value="item.user"
              >
                <span style="float: left">{{ item.user }}</span>
                <span
                  style="position: relative;right: -25px;float: right; color: var(--el-text-color-secondary); font-size: 12px"
                >{{ item.name }}</span>
              </el-option>
              <div v-if="userLoading" class="loading-indicator">
                加载中...
              </div>
            </el-select>
          </el-form-item>
          
          <el-form-item label="内容" prop="content">
            <el-input
              v-model="homeTalk.content"
              type="textarea"
              placeholder="请输入每日一言内容"
              style="width: 400px;"
              rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="clear()" plain>取 消</el-button>
        <el-button type="primary" @click="confirm()" plain>确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { findAllHomeTalk, addHomeTalk, updateHomeTalk, deleteHomeTalk } from '@/api/admin/home';
import { findAllUsersForSelect } from '@/api/admin/user';

// 暗黑模式支持
const isDark = inject('isDark');

// 每日一言数据
const homeTalks = ref([]);
const total = ref(0);
const page = ref(1);
const homeTalk = ref({
  id: '',
  date: '',
  user: '',
  content: ''
});
const dialogVisible = ref(false);
const dialogTitle = ref('');
const model = ref('');
const formRef = ref();
const userSelect = ref([]); // 用户选择列表


// 表单验证规则
const rules = reactive({
  id: [
    { validator: (rule, value, callback) => {
      if (model.value === 'add') {
        // 添加模式下ID可以为空
        callback();
      } else if (model.value === 'edit') {
        // 编辑模式下不验证，因为ID不可修改
        callback();
      }
    }, trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'blur' }
  ],
  user: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入每日一言内容', trigger: 'blur' },
    { min: 10, max: 500, message: '内容长度在 10 到 500 个字符', trigger: 'blur' }
  ]
});


// 获取每日一言列表 - 接口需手动填写
const getHomeTalkListData = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllHomeTalk(page.value,keyword.value).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      homeTalks.value = res.data.object || [];
      total.value = res.data.num || 0;
    } else {
      ElMessage.error('获取每日一言列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
  .finally(() => {
    loading.close()
  })
};
const handleCurrentChange = (e)=>{
  page.value = e
  getHomeTalkListData()
}
const remoteMethod = async(queryString)=>{
  if (!queryString) {
    userSelect.value = [];
    return;
  }
  const loading = ElLoading.service({
      lock: true,
      text: '搜索中...',
      background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllUsersForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      userSelect.value = res.data.object || [];
    } else {
      ElMessage.error('获取用户列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
  .finally(() => {
      loading.close()
  })
}



// 打开对话框
const openDialog = (e) => {
  clear();
  if (e === 0) {
    dialogTitle.value = '添加每日一言';
    model.value = 'add';
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    homeTalk.value.date = `${year}-${month}-${day}`;

  } else {
    dialogTitle.value = '编辑每日一言';
    model.value = 'edit';
    homeTalk.value = { ...e };
  }
  dialogVisible.value = true;
};

// 确认操作
const confirm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({
          lock: true,
          text: '处理中...',
          background: 'rgba(0, 0, 0, 0.7)'
      })
      if (model.value === 'add') {
        await addHomeTalk(homeTalk.value)
        .then(res=>{
          console.log(res);
          let msg = res.data.msg;
          if(msg === 'SUCCESS'){
            ElMessage.success('添加成功！');
          } else {
            ElMessage.error('添加失败！');
          }
        })
        .catch(err=>{
          console.log(err);
          ElMessage.error('服务异常');
        })
        .finally(() => {
            loading.close()
        });
        
        clear();
        getHomeTalkListData();
      } else if (model.value === 'edit') {
        await updateHomeTalk(homeTalk.value)
        .then(res=>{
          console.log(res);
          let msg = res.data.msg;
          if(msg === 'SUCCESS'){
            ElMessage.success('更新成功！');
          } else {
            ElMessage.error('更新失败！');
          }
        })
        .catch(err=>{
          console.log(err);
          ElMessage.error('服务异常');
        })
        .finally(() => {
            loading.close()
        });
        
        clear();
        getHomeTalkListData();
      }
    }
  });
};

// 删除每日一言 - 接口需手动填写
const onDel = (id) => {
  ElMessageBox.confirm('确定要删除该每日一言吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteHomeTalk(id).then(res=>{
      let msg = res.data.msg;
      if(msg === 'SUCCESS'){
        ElMessage.success('删除成功！');
      } else {
        ElMessage.error('删除失败！');
      }
    })
    .catch(err=>{
      console.log(err);
      ElMessage.error('服务异常');
    })
    .finally(() => {
        loading.close()
    });
    
    getHomeTalkListData();
  })
};

// 清空表单
const clear = () => {
  dialogVisible.value = false;
  homeTalk.value = {
    id: '',
    date: '',
    user: '',
    content: ''
  };
  
  if (formRef.value) {
    formRef.value.resetFields();
  }
};
const keyword = ref('')
const search = ()=>{
  getHomeTalkListData();
}


// 初始加载数据
onMounted(async() => {
  await getHomeTalkListData();
});
</script>

<style scoped>
/* 自定义用户选择下拉框样式 */
:deep(.user-select-dropdown) {
  max-height: 400px;
}

/* 加载指示器样式 */
.loading-indicator {
  text-align: center;
  padding: 10px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.home-talk {
  padding: 20px;
}

.page {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.content-cell {
  word-break: break-all;
  white-space: normal;
  line-height: 1.5;
}

.dialogContent {
  padding: 10px;
}

</style>