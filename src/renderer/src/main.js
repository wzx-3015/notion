import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import i18n from '@/language/index'
import './const'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
