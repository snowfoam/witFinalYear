import axios from '@/libs/axios'
import store from '@/store'

export const login = ({ userType, email, password }) => {
  return axios.request({
    url: `/${userType}/login`,
    data: {
      email,
      password
    },
    method: 'post'
  })
}

export const register = ({ userType, email, password, firstName, lastName }) => {
  return axios.request({
    url: `/${userType}/register`,
    data: {
      email,
      password,
      firstName,
      lastName
    },
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: `/${store.state.user.userType}/getInfo`,
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout'
  })
}

