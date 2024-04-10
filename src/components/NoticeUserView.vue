<template>
    <div>
        <div class="datetime">
            <div>{{ props.notices.date }}</div>
        </div>
        <div v-for="(item,index) in props.notices.contents" :key="index">
            <div class="item" v-show="props.notices.fromUser != userStore.user">
                <div class="avatar">
                    <img :src="'/src/assets/avatar/'+props.notices.fromAvatar" alt="">
                </div>
                <div class="chatCloud">
                    {{ item }}
                </div>
            </div>
            <div class="item self" v-show="props.notices.fromUser == userStore.user">
                <div class="chatCloud">
                    {{ item }}
                </div>
                <div class="avatar">
                    <img :src="'/src/assets/avatar/'+userStore.avatar" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import useUserStore from '@/stores/user';
import { ref } from 'vue';

const props = defineProps({
    notices:Object
});
const userStore = useUserStore()
const content = ref();
const init = ()=>{
    content.value = props.notices.content.split('[&divide&]')
}

</script>
<style scoped>
.datetime{
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #666;
    padding: 10px 0;
}
.item{
    width: 100%;
    min-height: 40px;
    display: flex;
    padding: 10px 5px;
}
.item .avatar{
    width: 40px;
    height: 40px;
    background-color: #f1f1f1;
    margin: 0 10px;
}
.item .avatar img{
    width: 36px;
    height: 36px;
    margin: 2px;
}
.chatCloud{
    width: fit-content;
    height: fit-content;
    background-color: #fcf8ee;
    padding: 8px 10px;
    border-radius: 10px;
    max-width: 600px;
    word-break: break-all;
    z-index: 1;
    user-select: text;
}
.self{
    justify-content: flex-end;
}
</style>