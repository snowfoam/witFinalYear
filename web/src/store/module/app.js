import {
  getHomeRoute,
} from '@/libs/util'

export default {
  state: {
    homeRoute: {}
  },
  getters: {},
  mutations: {
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, 'homeName')
    },

    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {

  }
}
