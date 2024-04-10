<template>
    <div>
        <Book>
            <table class="noticeBlock">
                <tr>
                    <th class="listTitle"></th>
                    <th class="userTitle">
                        <div class="userTitleMain">
                            title
                        </div>
                    </th>
                </tr>
                <tr>
                    <td>
                        <NoticeList/>
                    </td>
                    <td>
                        <NoticeUserView/>
                        <div class="sendBlock">
                            <textarea type="text" class="sendBox"></textarea>
                            <div class="operate">
                                <McBtn text="发送"/>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </Book>
    </div>
</template>
<script setup>
import Book from '@/components/Book.vue';
import NoticeList from '@/components/NoticeList.vue';
import NoticeUserView from '@/components/NoticeUserView.vue';
import McBtn from '@/components/McBtn.vue';
</script>
<style scoped>
.noticeBlock{
    width: 100%;
    border-collapse: collapse;
}
.noticeBlock th{
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    background-color: #c4ba9e;
}
.noticeBlock .listTitle{
    width: 25%;
    height: 50px;
    border-top-left-radius: 10px;
}

.noticeBlock .userTitle{
    border-top-right-radius: 10px;
}
.noticeBlock .userTitle .userTitleMain{
    height: 50px;
    padding-left: 30px;
    line-height: 60px;
}
.sendBlock{
    width: 100%;
    height: 200px;
    background-color: #f1f1f1;
}
.sendBox{
    border:0;
    outline: none;
    width: 720px;
    height: 140px;
    font-size: 18px;
    padding: 10px;
    resize: none;
    background-color: #f1f1f1;
}
.operate{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 60px;
    background-color: #f5f5f5;
}
</style>