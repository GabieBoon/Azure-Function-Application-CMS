import Vue from 'vue'
import App from './App.vue'
import Login from './views/Login.vue'
import store from './store/store'
import router from './router'
import vuetify from './plugins/vuetify'
import Buefy from 'buefy'
import ElementUI from 'element-ui'
import 'buefy/dist/buefy.css'
import 'element-ui/lib/theme-chalk/index.css'
import lang from "element-ui/lib/locale/lang/nl";
import locale from "element-ui/lib/locale";

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(ElementUI)
locale.use(lang)

if (!localStorage.getItem('token')) {
  new Vue({
    vuetify,
    store,
    router,
    render: h => h(Login)
  }).$mount('#app')
} else {
  new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}