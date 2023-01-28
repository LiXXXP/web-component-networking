import { createApp } from 'vue'
// import router from './router'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import { commonConfig } from '~/components/index'
commonConfig.loginCallback = () => {
  console.log('got to login')
}

commonConfig.noPermissionCallback = () => {
  console.log('got to 403 page')
}

commonConfig.serverErrorCallback = () => {
  debugger
  console.log('got to 9 page')
}

createApp(App).use(ElementPlus, { locale }).mount('#app')
