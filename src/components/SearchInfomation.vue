<template>
    <tbody>
        <tr>
            <Empty :height="20"/>
        </tr>
        <tr>
            <th><router-link class="keyContent" :to="'/topic/detail/'+props.data.id">{{ props.data.title }}</router-link></th>
        </tr>
        <tr>
            <td class="viewComment">评论:<span th:text="${topic.comment}">{{ props.data.comment }}</span> - 查看:<span>{{ props.data.view }}</span></td>
        </tr>
        <tr>
            <td class="content">
                <div class="keyContent" v-html="content"></div>
            </td>
        </tr>
        <tr>
            <td class="info">
                <span th:text="${topic.date}">{{ props.data.date }}</span>
                -
                <span><router-link :to="'/personal/other/'+props.data.user">{{ props.data.name }}</router-link></span>
                -
                <span>{{ props.data.label }}</span>
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
    },
    keyStr:String
})

const keyContent = (content,key)=>{
    let outKeyContent = props.data.content.split(key)
    if(content.length <= 100){
        let newContent = ''
        for (let i = 0; i < outKeyContent.length; i++) {
            newContent += outKeyContent[i]
            if(i != outKeyContent.length - 1){
                newContent += '<span style="color:darkred;font-weight:bold">'+key+'</span>'
            }
        }
        return newContent
    }
    else{
        let newContent = ''
        for (let i = 0; i < outKeyContent.length; i++) {
            if(outKeyContent[i].length>100){
                newContent += outKeyContent[i].substring(50,100)
            }
            else{
                newContent += outKeyContent[i]
            }
            if(i != outKeyContent.length - 1){
                newContent += '<span style="color:darkred;font-weight:bold">'+key+'</span>'
            }
            if(newContent.length >= 200){
                newContent += '...'
                break
            }
        }
        return newContent
    }
}
const content = ref(keyContent(props.data.content,props.keyStr))
</script>
<style scoped>
.tbody{
    width: 100%;
}
th{
    background-color: transparent;
    border: 0;
    font-size: 20px;
    text-align: left;
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
}
.viewComment{
    color: gray;
    font-size: 10px;
}
.content{
    font-size: 14px;
}
.info div{
    height: 40px;
    overflow: hidden;
    text-overflow:ellipsis;
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
.info span:nth-child(1){
    color: #037703;
}
</style>