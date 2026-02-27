<template>
    <tbody>
        <tr>
            <Empty :height="20"/>
        </tr>
        <tr>
            <th>
                <router-link class="title" :to="'/topic/detail/'+props.data.id" target="_blank" v-html="props.data.title"/>
            </th>
        </tr>
        <tr>
            <td class="viewComment">
                <router-link class="title" :to="'/topic/detail/'+props.data.id" target="_blank">
                    <span v-html="props.data.topicTitle"/> | <span v-html="props.data.enTitle"/>
                </router-link>
                
            </td>
        </tr>
        <tr>
            <td class="content">
                <div class="keyContent" v-html="props.data.content"></div>
            </td>
        </tr>
        <tr>
            <td class="info">
                <div>
                    <span>更新：<span class="date">{{ props.data.refreshTime }}</span></span>
                    <span>创建: <span class="date">{{ props.data.date.split('T')[0] }}</span></span>
                </div>
                <div>
                    <span><router-link :to="'/personal/other/'+props.data.user" v-html="props.data.name"/></span>
                    -
                    <span>{{ props.data.label }}</span>
                </div>
            </td>
        </tr>
    </tbody>
</template>
<script setup>
import Empty from '@/components/FitEmpty.vue'
import { ref } from 'vue'
const props = defineProps({
    data:{
        type: Object,
        default:{
            id:0,
            title:'主题',
            label: '插件',
            content:'内容',
            date:'2021-01-01',
            view: 0,
            comment: 0,
            user: 'admin',
            name: '管理员'
        }
    }
})

const content = ref(props.data.content)
</script>
<style>
hk{
    color: #b17822 !important;
    font-weight: bold;
}
</style>
<style scoped>
tbody{
    width: 100%;
}
tbody:hover{
    background-color: #f8f1e0;
    /* background-color: #7a5807; */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
    transition: all 0.3s ease;
}
th{
    background-color: transparent;
    border: 0;
    font-size: 20px;
    text-align: left;
    vertical-align: top;
    padding: 0 2%;
}
th a{
    color: darkblue;
    cursor: pointer;
    text-decoration: none;
}
th a:hover{
    color: midnightblue;
    text-decoration: underline;
}
td{
    background-color: transparent;
    border: 0;
    vertical-align: top;
    padding: 0 2%;
}
.title{
    text-decoration: none;
}
.title:hover{
    text-decoration: underline;
}
.viewComment{
    color: #492e04;
    font-size: 12px;
}
.content{
    font-size: 14px;
    overflow: hidden;
}
.info{
    height: auto;
    min-height: 30px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}
.info div{
    height: auto;
    min-height: 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    flex: 1;
}
.info div:nth-child(1){
    display: flex;
    flex-direction: row;
}
.info div:nth-child(2){
    text-align: right;
}
.info,.info a{
    color: #666666;
    font-size: 12px;
}
.info a{
    cursor: pointer;
    text-decoration: none;
}
.info a:hover{
    color: #333333;
    text-decoration: underline;
}
.info span{
    flex: 1;
}
.info span:nth-child(2){
    text-align: right;
}
.info span .date{
    color: #037703;
}
</style>