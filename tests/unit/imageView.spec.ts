import { mount } from '@vue/test-utils'
import ImageView from '~/ImageView/index.vue'

describe('ImageView', () => {
  const src = 'http://dummyimage.com/100x100/0079cb/fff'
  test('props src', () => {
    const wrapper = mount(ImageView, {
      props: { src }
    })
    const viewer = wrapper.find('.me-img') // 获取 DOM
    expect(viewer.exists()).toBeTruthy() // 是否存在
    const imgEl = viewer.find('img')
    expect(viewer.exists()).toBeTruthy()
    expect(imgEl.attributes('src')).toBe(src) // 传入的 src 地址是否在组件里正确
  })
})
