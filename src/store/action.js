/*
包含n个间接更新状态数据的方法的对象
*/
import router from '../router'
export default {
  // 返回
  FALLBACK() {
    router.go(-1)
  }
}
