import { createApp } from 'vue'
import {createPinia} from "pinia"
import Notifications from '@kyvg/vue3-notification'
import './style.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


import './index.css'
const pinia = createPinia()
const app = createApp(App)


pinia.use(piniaPluginPersistedstate)
app.use(Notifications)
app.use(pinia)
app.use(router)
app.mount('#app')
