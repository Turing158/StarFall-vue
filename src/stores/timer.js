import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer-Sf', () => {
  const imageTimer = ref('')
  const forgetPasswordTimer = ref('')
  const oldEmailTimer = ref('')
  const newEmailTimer = ref('')
  const regEmailTimer = ref('')
  const sendMsgTimer = ref('')

  const setImageTimer = (ImageTimer)=>{
    imageTimer.value = ImageTimer
  }
  const setForgetPasswordTimer = (ForgetPasswordTimer)=>{
    forgetPasswordTimer.value = ForgetPasswordTimer
  }
  const setOldEmailTimer = (OldEmailTimer)=>{
    oldEmailTimer.value = OldEmailTimer
  }
  const setNewEmailTimer = (NewEmailTimer)=>{
    newEmailTimer.value = NewEmailTimer
  }
  const setRegEmailTimer = (RegEmailTimer)=>{
    regEmailTimer.value = RegEmailTimer
  }
  const setSendMsgTimer = (SendMsgTimer)=>{
    sendMsgTimer.value = SendMsgTimer
  }
  
  return { imageTimer,forgetPasswordTimer,oldEmailTimer,newEmailTimer,regEmailTimer,sendMsgTimer,setImageTimer,setForgetPasswordTimer,setOldEmailTimer,setNewEmailTimer,setRegEmailTimer,setSendMsgTimer }
},
{
  persist: true,
})
export default useTimerStore
