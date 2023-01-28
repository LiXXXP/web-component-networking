import { AxiosRequestConfig } from 'axios'
import { NOOP } from '@vue/shared'
import { Response } from './response'

export declare type NoArgsCallbackFunction = () => void
/** 通用配置 */
export interface CommonConfig {
  tokenKey: string
  userIdKey: string
  entityIdKey: string
  channelKey: string
  loginCallback: NoArgsCallbackFunction
  noPermissionCallback: NoArgsCallbackFunction
  businessNoPermissionCallback: NoArgsCallbackFunction
  requestUserRoleResCallback: NoArgsCallbackFunction
  serverErrorCallback: NoArgsCallbackFunction
}

export const commonConfig: CommonConfig = {
  tokenKey: 'accessToken',
  userIdKey: 'userId',
  entityIdKey: 'entityId',
  channelKey: 'channel',
  loginCallback: NOOP,
  noPermissionCallback: NOOP,
  businessNoPermissionCallback: NOOP,
  requestUserRoleResCallback: NOOP,
  serverErrorCallback: NOOP
}

/** Axios 配置 */
export const axiosRequestConfig: AxiosRequestConfig = {
  timeout: 30000,
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json'
  }
}

/** 请求公共参数配置 */
export interface RequestContextConfig {
  channel: string
  entityId: string
  locale: string
  orgId: string
  privileges: string
  roles: string
  serviceId: string
  userId: string
}

export const requestContextConfig: RequestContextConfig = {
  channel: 'pc',
  entityId: 'gwin',
  locale: '',
  orgId: '',
  privileges: '',
  roles: '',
  serviceId: '',
  userId: ''
}

export interface RequestError {
  message: string
  isAxiosError: boolean
  response: Response
}
