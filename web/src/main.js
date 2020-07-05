import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import './styles/index.less'

Vue.use(iView)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
