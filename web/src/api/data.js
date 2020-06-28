import axios from '@/libs/axios'

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}
