<template>
    <div>
        <Book>
            <div class="content">
                <el-button @click="Click"></el-button>
            </div>
        </Book>
    </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import useUserStore from '@/stores/user'
const userStore = useUserStore();
const click = ()=>{

}
</script>
