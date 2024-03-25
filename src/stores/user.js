import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user-Sf', () => {
  const user = ref('')
  const name = ref('')
  const level = ref(0)
  const exp = ref(0)
  const maxExp = ref(0)
  const gender = ref(0)
  const birthday = ref('')
  const avatar = ref('')
  const email = ref('')
  const isLogin = ref(false)


  const setUserObject = (User, Name, Level, Exp, MaxExp, Gender, Birthday,Avatar,Email) => {
    user.value = User
    name.value = Name
    level.value = Level
    exp.value = Exp
    maxExp.value = MaxExp
    gender.value = Gender
    birthday.value = Birthday
    avatar.value = Avatar
    email.value = Email
  }
  const setLogin = (bool)=>{
    isLogin.value = bool
  }

  const exit = ()=>{
    user.value = ''
    name.value = ''
    level.value = 0
    exp.value = 0
    maxExp.value = 0
    gender.value = 0
    birthday.value = ''
    avatar.value = ''
    email.value = ''
    isLogin.value = false
  }

  return { user, name, level, exp, maxExp, gender, birthday,avatar,email,isLogin, setUserObject,setLogin,exit }
},
{
  persist: true,
})
export default useUserStore
