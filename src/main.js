import { createApp } from 'vue'
import router from './router/index.js'
import store  from './store/index.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main_web/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import api from './api/main_web/api'
import'./api/main_web/mock.js'


const app = createApp(App)
//使用element-icon 空间
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

//全局使用api接口
app.config.globalProperties.$api=api;  

app.use(ElementPlus).use(router).use(store)


app.mount('#app')
