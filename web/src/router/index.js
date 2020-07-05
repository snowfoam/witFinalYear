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
  // no login
  if (!token && !allowed ) {
    next({ name: 'login' })
  } else if (!token && allowed) {
    next()
  } else if (token && to.name === 'login') {
    next({ name: 'home' })
    // no user info
  } else if (!store.state.user.hasUserInfo) {
    try {
      // get user info
      await store.dispatch('getUserInfo')
    } catch (e) {
      // reset token and to login page
      setToken()
      next({ name: 'login' })
    }
    // access
  } else {
    next()
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
