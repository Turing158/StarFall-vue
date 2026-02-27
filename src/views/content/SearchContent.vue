<template>
    <div>
        <Book>
            <div>
                <div class="search">
                    <el-select
                    style="position: absolute; width: 100px; height: 30px; outline: none; border: 0; z-index: 1"
                    v-model="classification"
                    placeholder="筛选"
                    >
                    <el-option label="综合" value="综合"></el-option>
                    <el-option label="作者" value="作者"></el-option>
                    <el-option label="主题" value="主题标题"></el-option>
                    <el-option label="内容" value="主题内容"></el-option>
                    </el-select>
                    <input type="text" v-model="text" v-on:keydown.enter="onSearch"/>
                    <div class="btn" @click="onSearch()">
                        <div class="icon"></div>
                        <span>搜索</span>
                    </div>
                </div>
            </div>
            <div class="content">
                <table class="result">
                    <tbody class="none" v-show="result.length == 0">
                        <tr>
                            <td>搜点！现在啥都没有</td>
                        </tr>
                    </tbody>
                    <SearchInfomation v-for="(item,index) in result" :key="index" :data="item"/>
                </table>
                <div class="operate">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="10"
                        :background="true"
                        @current-change="changePage"
                        v-show="result.length != 0"
                    />
                </div>
            </div>
        </Book>
    </div>
</template>
<script setup>
import { searchTopic } from '@/api/topic';
import Book from '@/components/Book.vue';
import SearchInfomation from '@/components/SearchInfomation.vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { ElLoading } from 'element-plus'
const text = ref('')
const classification = ref('综合')
const pageNum = ref(1);
const total = ref(0)
const changePage = (e) => {
    pageNum.value = e;
    onSearch();
}
const result = ref([])
const key = ref('')
const onSearch = async()=>{
    if(text.value.length == 0){
        ElMessage.warning('搜点什么吧！') 
    }
    else{
        let loading = ElLoading.service({
            lock: true,
            text: '搜索中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        await searchTopic(text.value,classification.value,pageNum.value).then(res=>{
            let data = res.data.object
            total.value = res.data.num
            result.value = data
            console.log(res.data.num)
        }).catch(err=>{
            ElMessage.error('搜索失败')
        })
        loading.close()
    }
}
const init = ()=>{
    if(localStorage.getItem('search')){
        text.value = localStorage.getItem('search')
        onSearch()
        localStorage.removeItem('search')
    }
}
onMounted(init)
</script>
<style scoped>
.result{
    width: 96%;
    min-height: 500px;
    border: 0;
    border-collapse: collapse;
    margin: 0 2.5%;
    margin-top: 10px;
    display: block;
}
.none{
    text-align: center;
    font-size: 20px;
    color: gray;
    height: 500px; /* 为无结果状态设置最小高度 */
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
}
.operate{
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 20px;
}
.search {
  width: 90%;
  border: 2px solid #131313;
  border-radius: 5px;
  margin: 0 5%;
  height: 32px;
  display: flex;
  overflow: hidden;
}
.search input {
  position: relative;
  outline: none;
  border: 0;
  width: calc(100% - 120px - 50px);
  height: 30px;
  padding: 0 10px;
  font-size: 16px;
  left: 100px;
}
.btn {
  position: relative;
  width: 80px;
  height: 32px;
  background-color: #aaa;
  color: #131313;
  left: 70px;
  cursor: pointer;
  transition: all 250ms;
  display: flex;
}
.btn:hover {
  background-color: #131313;
  color: #f1f1f1;
}
.btn .icon {
  position: relative;
  top: 3px;
  left: 6px;
  width: 25px;
  height: 25px;
  background-image: url(../../assets/img/search0.png);
  background-size: cover;
  background-repeat: no-repeat;
  transition: all 250ms;
}
.btn:hover .icon {
  background-image: url(../../assets/img/search1.png);
}
.btn span {
  position: relative;
  top: 3px;
  left: 12px;
  font-size: 18px;
  font-weight: bold;
}
</style>