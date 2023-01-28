import Cookies from 'js-cookie'
import { AxiosResponse } from 'axios'
import { commonConfig } from './config'

export function getAccessToken(): string | undefined {
  return Cookies.get(commonConfig.tokenKey)
}

export function getAdminAccessToken(): string | undefined {
  return Cookies.get('adminToken')
}

export function getUserId(): string | undefined {
  return Cookies.get(commonConfig.userIdKey)
}

export function getAdminUserId(): string | undefined {
  return Cookies.get('adminUserId')
}

export function getEntityId(): string | undefined {
  return Cookies.get(commonConfig.entityIdKey)
}

export function getAdminEntityId(): string | undefined {
  return Cookies.get('adminEntityId')
}

export function getChannel(): string | undefined {
  return Cookies.get(commonConfig.channelKey)
}

export function getAdminChannel(): string | undefined {
  return Cookies.get('adminChannel')
}

export function downloadBlob(response: AxiosResponse<any>) {
  const blob = response.data
  const disposition = response.headers['content-disposition']
  let filename = ''
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = filenameRegex.exec(disposition)
  if (matches !== null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '')
    filename = decodeURIComponent(filename)
  }
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = (e) => {
    const a = document.createElement('a')
    a.download = filename
    a.href = (e.target && e.target.result) as string
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

export function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj

  if (obj instanceof Date) {
    const copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  if (obj instanceof Array) {
    const copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i])
    }
    return copy
  }

  if (obj instanceof Object) {
    const copy: Record<any, any> = {}
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepClone(obj[attr])
      }
    }
    return copy
  }

  return obj
}
