import { Request, Response } from '~/components/index'

export interface User {
  id: number
  address1: string
  address2: string
  business: string
  country: string
  createAt: string
  customerId: string
  email: string
  entityId: string
}

class UserApi {
  async login(params: any) {
    const request = new Request<User>({
      url: '/cif/v1/AccountSignIn',
      method: 'post',
      params: params
    })
    return await request.start()
  }

  async getTest(params?: any) {
    const request = new Request<User>({
      url: '/user/info',
      method: 'get',
      params: params,
      isLoading: true
    })
    return await request.start()
  }

  async postTest(params?: any) {
    const request = new Request<User>({
      url: '/gwtm/v1/DailyUsageExport',
      params: params,
      isLoading: true,
      config: {
        responseType: 'blob'
      }
    })
    return await request.start()
  }

  async adminPostTest(params?: any) {
    const request = new Request<User>({
      url: '/api/sp/v1/AdminSpaceListInquiry',
      params: params,
      isLoading: true,
      config: {
        type: 'admin'
      }
    })
    return await request.start()
  }

  async postTest401(params?: any) {
    const request = new Request<User>({
      url: '/user/info401',
      params: params,
      isLoading: true
    })
    return await request.start()
  }

  async postTest403(params?: any) {
    const request = new Request<User>({
      url: '/user/info403',
      params: params,
      isLoading: true
    })
    return await request.start()
  }

  async postTestErrorCode1(params?: any) {
    const request = new Request<User>({
      url: '/user/infoErrorCode1',
      params: params,
      isLoading: true,
      isMessage: true,
      replyCodes: ['103']
    })
    return await request.start()
  }

  async postTestErrorCode9(params?: any) {
    const request = new Request<User>({
      url: '/user/infoErrorCode9',
      params: params,
      isLoading: true,
      isMessage: true
      // isError: true
    })
    return await request.start()
  }
}

export default new UserApi()
