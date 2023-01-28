import { AxiosResponse } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
import { nextTick } from 'vue'
import { commonConfig, RequestError } from './config'
import axios from './index'
import { Response } from './response'

export interface RequestConfig {
  url: string
  method?: string
  params?: any
  isLoading?: boolean
  isMessage?: boolean
  isError?: boolean
  config?: Record<string, string>
  replyCodes?: string[]
}

export class Request<T> {
  private config: RequestConfig = {
    url: '',
    method: 'post',
    params: {},
    isLoading: false,
    isMessage: false,
    isError: false,
    config: {}
  }
  public constructor(config: RequestConfig) {
    this.config = Object.assign(this.config, config)
  }

  async start(): Promise<Response<T>> {
    let loading: LoadingInstance
    let response: AxiosResponse<Response<T>>
    let error: RequestError
    try {
      if (this.config.isLoading) {
        loading = ElLoading.service({ fullscreen: true })
      }
      if (this.config.method === 'get') {
        response = await axios.get<Response<T>>(this.config.url, { params: this.config.params })
      } else {
        // 默认按照post处理
        response = await axios.post<Response<T>>(this.config.url, this.config.params, this.config.config)
      }
      const replayCode = response.data.status.replyCode
      if (!response.data.status.success && !this.config.replyCodes?.includes(replayCode)) {
        let message = response.data.status.replyText
        if (response.data.status.errorCode === '401') {
          commonConfig.businessNoPermissionCallback()
        } else if (response.data.status.errorCode === '403') {
          commonConfig.requestUserRoleResCallback()
        } else if (response.data.status.errorCode === '9') {
          message = '系统开了小差，请刷新试试！'
          commonConfig.serverErrorCallback()
        }
        const error: RequestError = {
          message: message,
          isAxiosError: false,
          response: response.data
        }
        throw error
      }
    } catch (e: any) {
      error = e
      if (this.config.isMessage) {
        const msg = e.message || '网络开了小差，请刷新试试！'
        msg && ElMessage.error(msg)
      }
    } finally {
      if (this.config.isLoading) {
        nextTick(() => {
          loading.close()
        })
      }
    }
    return new Promise((resolve, reject) => {
      if (error === undefined) {
        resolve(response.data)
      } else {
        if (this.config.isError) {
          reject(error)
        }
      }
    })
  }
}
