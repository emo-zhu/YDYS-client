import { createApp } from 'vue'
import {TableFullHeightDirective} from 'junegoo-ui';
import { createDiscreteApi } from 'naive-ui'
import 'junegoo-ui/es/style/index.css'  //全局样式base.css,reset.css
import 'junegoo-ui/es/style.css'   //组件样式
import 'junegoo-ui/es/iconfont/iconfont.css'  //图标样式
import router from './router'
import junegoo from 'junegoo-ui';
import App from './App.vue'

const app = createApp(App)
app.use(junegoo)
app.use(router)
app.mount('#app')
app.use(TableFullHeightDirective)

const { message, notification, dialog, loadingBar } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar']
)

window.$message = message;
window.$dialog = dialog;
