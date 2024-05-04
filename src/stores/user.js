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
  const role = ref('')
  const isLogin = ref(false)
  const token = ref()


  const setUserObject = (User, Name, Level, Exp, MaxExp, Gender, Birthday,Avatar,Email,Role) => {
    user.value = User
    name.value = Name
    level.value = Level
    exp.value = Exp
    maxExp.value = MaxExp
    gender.value = Gender
    birthday.value = Birthday
    avatar.value = Avatar
    email.value = Email
    role.value = Role
  }
  const setEmail = (Email)=>{
    email.value = Email
  }
  const setAvatar = (Avatar)=>{
    avatar.value = Avatar
  }
  const setLogin = (bool)=>{
    isLogin.value = bool
  }

  const setToken = (Token)=>{
    token.value = Token
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
    token.value = ''
  }


  return { user, name, level, exp, maxExp, gender, birthday,avatar,email,role,isLogin,token,setUserObject,setLogin,setToken,exit,setEmail,setAvatar }
},
{
  persist: true,
})
export default useUserStore
