import axios from 'axios'
import { Message } from 'view-design'

class HttpRequest {
  constructor() {
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: '/',
      headers: {}
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
    }
  }
  interceptors(instance, url) {
    instance.interceptors.request.use(config => {
      if (!Object.keys(this.queue).length) {
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })

    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      if (!res.data.success) {
        Message.error(res.data.message)
      }
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default new HttpRequest()
