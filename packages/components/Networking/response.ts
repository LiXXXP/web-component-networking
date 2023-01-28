export interface ResponseStatus {
  appName: string
  duration: number
  errorCode: string
  memo: string
  replyCode: string
  replyText: string
  success: boolean
}

export interface Response<T = any> {
  body: T
  status: ResponseStatus
}
