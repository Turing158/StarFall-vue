import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref("")
  const name = ref("")
  const level = ref(0)
  const exp = ref(0)
  const maxExp = ref(0)
  const gender = ref(0)
  const brith = ref("")
  const getUserObject = ()=>{
    return {
        user:user.value,
        name:name.value,
        level:level.value,
        exp:exp.value,
        maxExp:maxExp.value,
        gender:gender.value,
        brith:brith.value
    }
  }
  const setUserObject = (user,name,level,exp,maxExp,gender,brith)=>{
    user.value = user;
    name.value = name;
    level.value = level;
    exp.value = exp;
    maxExp.value = maxExp;
    gender.value = gender;
    brith.value = brith;
  }
  

  return { user,name,level,exp,maxExp,gender,brith,getUserObject,setUserObject }
})
