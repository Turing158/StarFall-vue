<template>
    <div>
        <span class="listTitle">{{ props.title }}</span>
        <table class="main">
            <tr class="item" v-for="(item,index) in props.data" :key="index">
                <span class="num"><span>{{ index+1 }}</span></span>
                <span class="title" @click="goDetail(item.id)" :title="item.title">{{ item.title }}</span>
                <img class="avatar" :src="getAvatarSrc(item.avatar)" :title="item.name" @click="goUser(item.user)" />
            </tr>
            <tr class="item empty" v-if="!loading && (props.data == null || props.data.length == 0)">
                暂无数据
            </tr>
            <tr class="item loading" v-if="loading">
                
            </tr>
        </table>
    </div>
</template>
<script setup>
import router from '@/router'
import { getAvatarSrc } from '@/api/user';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const props = defineProps({
    title:String,
    data:Array,
    loading:Boolean
})
const goDetail = (id) => {
    router.push("/topic/detail/"+id)
}
const goUser = (user) => {
    router.push("/personal/other/"+user)
}
</script>
<style scoped>
.main{
    width: 100%;
    margin-bottom: 5px;
}
.listTitle{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    margin-left: 10%;
}
.item:first-child{
    border-top: 1px solid #a58960;
}
.item:last-child{
    border-bottom: 1px solid #a58960;
}
.item{
    display: flex;
    background: #f3debf;
    border-bottom: 1px dotted #a58960;
    padding: 2px 5px;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
}
.num{
    width: 22px;
    height: 22px;
    background: #a58960;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    color: #f1f1f1;
    font-size: 14px;
}
.num span{
    margin-bottom: 2px;
}
.item:nth-child(1) .num{
    background-color: darkgreen;
}
.item:nth-child(2) .num{
    background-color: darkslategrey;
}
.item:nth-child(3) .num{
    background-color: darkgoldenrod;
}
.title{
    width: 255px;
    margin: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    font-size: 13px;
}
.title:hover{
    text-decoration: underline;
}
.avatar{
    width: 20px;
    height: 20px;
    object-fit: cover;
    cursor: pointer;
}
.empty{
    justify-content: center;
}
.loading{
    height: 100px;
}
</style>