import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, AxiosInstance } from 'axios'
import { axiosRequestConfig, requestContextConfig, commonConfig } from './config'
import {
  getAccessToken,
  getAdminAccessToken,
  getUserId,
  downloadBlob,
  getEntityId,
  getChannel,
  getAdminUserId,
  getAdminEntityId,
  getAdminChannel,
  deepClone
} from './utils'

const instance: AxiosInstance = axios.create(axiosRequestConfig)

type GWinAxiosRequestConfig = AxiosRequestConfig & { type?: string }

instance.interceptors.request.use(
  (config: GWinAxiosRequestConfig) => {
    // 设置header
    const header = config.headers ? config.headers : {}
    const token = config.type && config.type === 'admin' ? getAdminAccessToken() : getAccessToken()
    if (token !== undefined) {
      header.accessToken = token
    }
    config.headers = header
    // 设置公共参数
    const context = deepClone(requestContextConfig)

    const userId = config.type && config.type === 'admin' ? getAdminUserId() : getUserId()
    if (userId !== undefined) {
      context.userId = userId
    }
    const entityId = config.type && config.type === 'admin' ? getAdminEntityId() : getEntityId()
    if (entityId !== undefined && entityId.length > 0) {
      context.entityId = entityId
    }
    const channel = config.type && config.type === 'admin' ? getAdminChannel() : getChannel()
    if (channel !== undefined && channel.length > 0) {
      context.channel = channel
    }
    const data = config.data ? config.data : {}
    data.context = context
    config.data = data

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  async (response: AxiosResponse) => {
    const contentType = response.headers['content-type']
    if (
      contentType &&
      (contentType.indexOf('application/octet-stream') > -1 ||
        contentType.indexOf('application/x-msdownload') > -1 ||
        contentType.indexOf('application/x-download') > -1 ||
        contentType.indexOf('application/vnd.ms-excel') > -1 ||
        contentType.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') > -1)
    ) {
      downloadBlob(response)
      const defaultRes = {
        status: {
          appName: 'gwin',
          duration: 0,
          errorCode: '',
          memo: '',
          replyCode: '',
          replyText: '',
          success: true
        },
        body: {}
      }
      response.data = Object.assign(response.data, defaultRes)
      return response
    } else {
      if (response.data.type && response.data.type === 'application/json') {
        const data = await blob_to_json(response.data)
        response.data = data
      }
      return response
    }
  },
  (error: AxiosError) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误(400)'
          break
        case 401:
          commonConfig.loginCallback()
          error.message = '您的登录状态已失效，请重新登录'
          break
        case 403:
          commonConfig.noPermissionCallback()
          error.message = '拒绝访问(403)'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 405:
          error.message = '请求方法未允许(405)'
          break
        case 408:
          error.message = '请求超时(408)'
          break
        case 500:
          error.message = '服务器内部错误(500)'
          break
        case 501:
          error.message = '服务未实现(501)'
          break
        case 502:
          error.message = '网络错误(502)'
          break
        case 503:
          error.message = '服务不可用(503)'
          break
        case 504:
          error.message = '网络超时(504)'
          break
        case 505:
          error.message = 'HTTP版本不受支持(505)'
          break
        default:
          error.message = `连接错误: ${error.message}`
          break
      }
    } else {
      error.message = '连接到服务器失败，请联系管理员'
    }
    return Promise.reject(error)
  }
)

async function blob_to_json(blob: Blob) {
  const json = new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(blob, 'utf-8')
    reader.onload = () => {
      const result = JSON.parse(reader.result as string)
      resolve(result)
    }
    reader.onerror = () => {
      reject('转换失败')
    }
  })
  return json
}

export default instance
