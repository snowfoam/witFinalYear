import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'view-design'
import { setToken, getToken } from '@/libs/util'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start()

  const token = getToken()
  const allowed = to.name === 'login' || to.name === 'register'

  if (!token) { // no login
    if (!allowed) next({ name: 'login' })
    else next()
  } else {
    if (to.name === 'login') {
      next({ name: 'home' })
    } else if (!store.state.user.hasUserInfo) {  // no user info
      try {
        await store.dispatch('getUserInfo') // get user info
        next()
      } catch (e) {
        setToken() // reset token and to login page
        next({ name: 'login' })
      }
    } else {
      next() // access
    }
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
