import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/css/main.css'

const app = createApp(App)

// Register Pinia for state management
app.use(createPinia())

// Register Router
app.use(router)

// Mount app
app.mount('#app')
