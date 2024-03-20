import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user-Sf', () => {
  const user = ref('')
  const name = ref('')
  const level = ref(0)
  const exp = ref(0)
  const maxExp = ref(0)
  const gender = ref(0)
  const brith = ref('')

  const setUserObject = (User, Name, Level, Exp, MaxExp, Gender, Brith) => {
    user.value = User
    name.value = Name
    level.value = Level
    exp.value = Exp
    maxExp.value = MaxExp
    gender.value = Gender
    brith.value = Brith
  }

  return { user, name, level, exp, maxExp, gender, brith, setUserObject }
},
{
  persist: true,
})
export default useUserStore
