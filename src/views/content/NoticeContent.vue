<template>
    <div>
        <Book>
            <table class="noticeBlock">
                <tr>
                    <th class="listTitle"></th>
                    <th class="userTitle">
                        <div class="userTitleMain">
                            {{ noticeTitle }}
                        </div>
                    </th>
                </tr>
                <tr>
                    <td>
                        <div class="noticeList">
                            <div v-for="(item,index) in noticeUserList" :key="index" @click="listClick(item,index)">
                                <NoticeList :item="item" :active="index == listIndex" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <div ref="noticeUser" class="noticeUser">
                            <div v-for="(item,index) in notices" :key="index">
                                <NoticeUserView :notices="item"/>
                            </div>
                        </div>
                        
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
import { findAllMsgByToUser, findMsgByToUserAndFromUser } from '@/api/message';
import { ElMessage,ElNotification } from 'element-plus';
import { inject, nextTick, onMounted,ref } from 'vue';
import useUserStore from '@/stores/user';
const notices = ref([]);
const noticeUserList = ref([]);
const noticeTitle = ref('')
const listIndex = ref(0)
const noticeUser = ref(null)
const userStore = useUserStore()
const init = async()=>{
    await getUserList()
    await getUserMsg(noticeUserList.value[listIndex.value].user)
    noticeTitle.value = noticeUserList.value[listIndex.value].name
}
const getUserList = async()=>{
    await findAllMsgByToUser().then(res=>{
        let msg = res.data.msg;
        if(msg == 'SUCCESS'){
            let data = res.data.object
            for (let i = 0; i < data.length; i++) {
                let content = data[i].content.split('[&divide&]')
                let lastContent = content[content.length-1]
                if(noticeUserList.value.length == 0){
                    if(data[i].fromUser == userStore.user){
                        let userList = {
                            user: data[i].toUser,
                            name: data[i].toName,
                            avatar: data[i].toAvatar,
                            lastContent:lastContent,
                        }   
                        noticeUserList.value.push(userList)
                    }
                    else{
                        let userList = {
                            user: data[i].fromUser,
                            name: data[i].fromName,
                            avatar: data[i].fromAvatar,
                            lastContent:lastContent,
                        }   
                        noticeUserList.value.push(userList)
                    }
                }
                else{
                    let flag = true
                    for (let j = 0; j < noticeUserList.value.length; j++) {
                        if(data[i].fromUser == userStore.user){
                            if(noticeUserList.value[j].user == data[i].toUser){
                                flag = false
                                break;
                            }
                        }
                        else{
                            if(noticeUserList.value[j].user == data[i].fromUser){
                                flag = false
                                break;                  
                            }
                        }
                    }
                    if(flag){
                        if(data[i].fromUser == userStore.user){
                            let userList = {
                                user: data[i].toUser,
                                name: data[i].toName,
                                avatar: data[i].toAvatar,
                                lastContent:lastContent
                            }
                            noticeUserList.value.push(userList)
                        }
                        else{
                            let userList = {
                                user: data[i].fromUser,
                                name: data[i].fromName,
                                avatar: data[i].fromAvatar,
                                lastContent:lastContent
                            }
                            noticeUserList.value.push(userList)
                        }
                    }
                }
            }
        }
        
    }).catch(err=>{
        ElMessage.error('服务异常');
    });
}
const setViewBottom = ()=>{
    noticeUser.value.scrollTop = noticeUser.value.scrollHeight
}
const getUserMsg = async(fromUser)=>{
    notices.value = []
    await findMsgByToUserAndFromUser(fromUser).then(res=>{
        let msg = res.data.msg;
        if(msg == 'SUCCESS'){
            let data = res.data.object
            for (let i = 0; i < data.length; i++) {
                let contents = data[i].content.split('[&divide&]')
                notices.value.push({
                    fromUser: data[i].fromUser,
                    fromAvatar: data[i].fromAvatar,
                    date: data[i].date,
                    contents: contents
                })
            }
        } 
    }).catch(err=>{
        ElMessage.error('服务异常');
        console.log(err);
    })
    setViewBottom()
}
const listClick = (item,index)=>{
    listIndex.value = index
    noticeTitle.value = item.name
    getUserMsg(item.user)
}
const webSocket = inject('webSocket')
webSocket.value.onmessage = (e) => {
    let data = JSON.parse(e.data)
    ElNotification({
        title:'新消息-来自'+data.fromUser+'的消息',
        message:data.content,
        type:'success'
    })
    // init()
    if(data.fromUser == noticeUserList.value[listIndex.value].user || data.fromUser == userStore.user){
        let obj = {
            fromUser: data.fromUser,
            fromAvatar: data.fromAvatar,
            date: data.date,
            contents: [data.content]
        }
        if(notices.value[notices.value.length-1].fromUser == obj.fromUser){
            if(timeDiff(notices.value[notices.value.length-1].date,obj.date) < 1){
                notices.value[notices.value.length-1].contents.push(data.content)
            }
            else{
                notices.value.push(obj)
            }
        }else{
            notices.value.push(obj)
        }
        setTimeout(() => {
            setViewBottom()
        }, 10);
    }
    else{
        let flag = true
        for (let i = 0; i < noticeUserList.value.length; i++) {
            if(noticeUserList.value[i].user == data.fromUser){
                flag = false
                break
            }
        }
        if(flag){
            let userList = {
                user: data.fromUser,
                name: data.fromName,
                avatar: data.fromAvatar,
                lastContent:data.content
            }
            let newlist = []
            newlist.push(userList)
            for (let i = 0; i < noticeUserList.value.length; i++) {
                newlist.push(noticeUserList.value[i])
            }
            noticeUserList.value = newlist
            listIndex.value ++;
        }

    }
    
}
const timeDiff = (newDate,oldDate)=>{
    let new_date = new Date(newDate)
    let old_date = new Date(oldDate)
    console.log(new_date)
    let diffInMilliseconds = new_date.getTime() - old_date.getTime()
    return Math.abs(diffInMilliseconds / (1000 * 60))
}
onMounted(init)
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
    background-color: #f3ddab;
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
.noticeList{
    height: 550px;
    width:100%;
    background-color: #f8eecf;
    border-bottom-left-radius: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 250ms;
}
.noticeList::-webkit-scrollbar {
    width: 6px;
}
.noticeList::-webkit-scrollbar-thumb {
    background-color: #756c53;
    cursor:n-resize;
}
.noticeUser{
    height: 350px;
    background-color: #faf1d9;
    overflow-y: auto;
    overflow-x: hidden;
}
.noticeUser::-webkit-scrollbar {
    width: 6px;
    
}
.noticeUser::-webkit-scrollbar-thumb {
    background-color: #756c53;
    cursor:n-resize;
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