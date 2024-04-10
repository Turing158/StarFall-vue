<template>
    <div class="main">
        <div class="item" v-for="i in 10" :key="i">
            <div class="avatar"></div>
            <div class="info">
                <div class="username">name</div>
                <div class="content">contentcontentcontent</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.main{
    height: 550px;
    width:100%;
    background-color: #ecdfb8;
    border-bottom-left-radius: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 250ms;
}
.main::-webkit-scrollbar {
    width: 6px;
}
.main::-webkit-scrollbar-thumb {
    background-color: #756c53;
}
.item{
    height: 100px;
    background-color: #f8edcf;
    border-bottom: 1px solid #aaa;
    cursor: pointer;
    display: flex;
}
.item:hover{
    background-color: #faf5e8;
}
.active{
    background-color: #f5eacb;
}
.item .avatar{
    width: 60px;
    height: 60px;
    background-color: #f1f1f1;
    margin: 15px 10px;
}
.item .info{
    height: 80px;
    margin: 15px 0;
}
.username{
    height: 35px;
    font-size: 18px;
    font-weight: bold;
}
.content{
    width: 110px;
    height: 30px;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
}
</style>