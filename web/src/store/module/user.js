import { login, register, logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userType: 'student',
    userInfo: null,
    hasUserInfo: false,
    token: getToken(),
  },
  mutations: {
    setUserType(state, userType) {
      state.userType = userType
    },
    setToken(state, data) {
      setToken(data)
    },
    setUserInfo(state, data) {
      if (data) {
        state.hasUserInfo = true
        state.userInfo = data.data
      } else {
        state.hasUserInfo = false
        state.userInfo = null
      }
    },
  },
  actions: {
    // login and set token
    async handleLogin({ commit }, params) {
      try {
        const { data } = await login(params)
        commit('setToken', data)
        commit('setUserType', params.userType)

        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    // register
    async handleRegister({ }, params) {
      try {
        const { data } = await register(params)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    // get user's info
    async getUserInfo({ commit }) {
      try {
        const { data } = await getUserInfo()
        commit('setUserInfo', data)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    // user logout
    async handleLogOut({ commit, state }) {
      try {
        await logout()
        commit('setUserInfo', null)
        commit('setToken', null)
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
  }
}
