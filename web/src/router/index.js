import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo } from '@/libs/util'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next()
  else next({ replace: true, name: 'error_401' })
}

router.beforeEach((to, from, next) => {
  next()
  // iView.LoadingBar.start()
  // const token = getToken()
  // if (!token && to.name !== LOGIN_PAGE_NAME) {
  //   next({
  //     name: LOGIN_PAGE_NAME
  //   })
  // } else if (!token && to.name === LOGIN_PAGE_NAME) {
  //   next()
  // } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   next({
  //     name: homeName
  //   })
  // } else {
  //   if (store.state.user.hasGetInfo) {
  //     turnTo(to, store.state.user.access, next)
  //   } else {
  //     store.dispatch('getUserInfo').then(user => {
  //       turnTo(to, user.access, next)
  //     }).catch(() => {
  //       setToken('')
  //       next({
  //         name: 'login'
  //       })
  //     })
  //   }
  // }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router